#! /bin/bash
# Merge and delete a branch; should be used in the branch to merge

branch=`git branch | awk ' /*/ { print $2 } '`
echo $branch
git checkout develop
git merge --no-ff $branch
git branch -d $branch