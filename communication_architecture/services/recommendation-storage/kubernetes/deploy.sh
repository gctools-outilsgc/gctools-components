#!/bin/sh
DOCKER_REPO="localhost:5000"
DOCKER_PACKAGE="gctools-outilsgc/recommendation-store"

# -----------------------------------------------------------------------------
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PREVIOUS=`cat $DIR/version.txt | awk -F. -v OFS=. 'NF==1{print --$NF}; NF>1{if(length($NF-1)>length($NF))$(NF+1)--; $NF=sprintf("%0*d", length($NF), ($NF-1)%(10^length($NF))); print}'`
CURRENT=`cat $DIR/version.txt`
VERSION=`cat $DIR/version.txt | awk -F. -v OFS=. 'NF==1{print ++$NF}; NF>1{if(length($NF+1)>length($NF))$(NF-1)++; $NF=sprintf("%0*d", length($NF), ($NF+1)%(10^length($NF))); print}'`

echo
echo "Docker package: $DOCKER_PACKAGE"
echo "Version: $CURRENT  ==>  $VERSION"
read -p "Increment the minor revision and deploy to kubernetes? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  docker rmi $DOCKER_REPO/$DOCKER_PACKAGE:$PREVIOUS
  (cd $DIR/../ && yarn build)
  CMD=$(echo sed -i "'s/localhost:5000\/gctools-outilsgc\/recommendation-store:$CURRENT/localhost:5000\/gctools-outilsgc\/recommendation-store:$VERSION/g'" $DIR/0_deployment.yaml)
  eval $CMD
  docker tag $DOCKER_PACKAGE:latest $DOCKER_REPO/$DOCKER_PACKAGE:$VERSION
  until docker push $DOCKER_REPO/$DOCKER_PACKAGE:$VERSION
  do
    echo "Error pushing to server, trying again in 1 second."
    sleep 1
  done
  kubectl apply -f $DIR
  echo $VERSION > $DIR/version.txt
  echo "$CURRENT ==> $VERSION deployed.";
  exit 0
fi

echo
echo "Fine, be that way."
echo
