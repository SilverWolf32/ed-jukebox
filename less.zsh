#!/bin/zsh -f

setopt extendedglob

for file in app/**/*.less; do
	echo "Converting $file"
	filename=${file##*/}
	# echo $file ${(S)file%%/[^/]*}/.compiled/${filename%%.less}.css
	node_modules/less/bin/lessc $file ${(S)file%%/[^/]*}/.compiled/${filename%%.less}.css
done
