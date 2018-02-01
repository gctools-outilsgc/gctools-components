#!/bin/sh
dir1=../dist
rsync -avz -e "ssh" --progress --delete "$dir1/" gcrecdb-bd:/home/nfs/gcpedia-dev-mod-nrc-recommendations
while true; do
  while inotifywait -qqre modify "$dir1"; do
      echo "performing sync..."
      rsync -avz -e "ssh" --progress --delete "$dir1/" gcrecdb-bd:/home/nfs/gcpedia-dev-mod-nrc-recommendations
  done
  sleep 1
done