#!/bin/zsh -f

for file in app/**/*.less; do
	node_modules/less/bin/lessc $file ${file%%.less}.css
done
