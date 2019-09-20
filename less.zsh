#!/bin/zsh -f

setopt extendedglob

for file in app/**/*.less; do
	echo "Converting $file"
	filename=${file##*/}
	node_modules/less/bin/lessc $file ${file%/*}/.compiled/${filename%%.less}.css
done
