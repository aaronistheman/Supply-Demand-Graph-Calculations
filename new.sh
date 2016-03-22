#! /bin/bash

for f in $@; do
  touch $f
  start Notepad++ $f
done