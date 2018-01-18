#!/bin/sh
DOCKER_REPO="localhost:5000"
DOCKER_PACKAGE="gctools-outilsgc/reference-implementation"

read -p "Increment the minor revision and deploy to kubernetes? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  PREVIOUS=`cat $DIR/version.txt | awk -F. -v OFS=. 'NF==1{print --$NF}; NF>1{if(length($NF-1)>length($NF))$(NF+1)--; $NF=sprintf("%0*d", length($NF), ($NF-1)%(10^length($NF))); print}'`
  CURRENT=`cat $DIR/version.txt`
  CMD=$(echo sed -i "'s/localhost:5000\/gctools-outilsgc\/reference-implementation:$CURRENT/localhost:5000\/gctools-outilsgc\/reference-implementation:$PREVIOUS/g'" $DIR/1_deployment.yaml)
  eval $CMD
  until docker push $DOCKER_REPO/$DOCKER_PACKAGE:$PREVIOUS
  do
    echo "Error pushing to server, trying again in 1 second."
    sleep 1
  done
  kubectl apply -f $DIR/1_deployment.yaml
  echo $PREVIOUS > $DIR/version.txt
  echo "$CURRENT ==> $PREVIOUS deployed.";
  exit 0
fi

echo
echo "Fine, be that way."
echo
