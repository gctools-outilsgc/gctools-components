#!/bin/sh
dir1=../dist
while true; do
  while inotifywait -qqre modify "$dir1"; do
      echo "performing sync..."
      rsync -avz -e "ssh" --progress "$dir1/" gcrecdb-bd:/home/nfs/gcpedia-dev-mod-nrc-recommendations
  done
  sleep 1
done