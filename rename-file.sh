#! /bin/bash
#
# @param $1 old/current name of the file
# @param $2 new name of the file
# @example rename-file.sh play.html play.php

# Rename the file
git mv $1 $2

# Edit the batch file that opens files (if applicable)
if [ -e open-my-files.bat ]
then
  sed -i "s~$1~$2~" open-my-files.bat
fi