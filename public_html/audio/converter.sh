#!/bin/bash
for file in *.mp3
  do avconv -y -i "${file}" -acodec libvorbis "`echo ${file%.mp3}.ogg`"
done
