#!/bin/bash

echo "Previewing $1"
if [ $# -eq 1 ]
  then
    echo "Creating index.html"
    sed "s/001/$1/" preview.html > index.html
    http-server .
fi
