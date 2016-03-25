#! /bin/bash
#
# @param $1 name of the file to create.
# @example add-file.sh hello-world.txt

if [ ! -e open-my-files.bat ]
then # create the file with proper format
  echo "exit" > open-my-files.bat
fi

# Create and open the file
touch $1
start Notepad++ $1

# Edit the batch file that opens files (if applicable)
sed -i "s~exit~start Notepad++ $1\nexit~" open-my-files.bat