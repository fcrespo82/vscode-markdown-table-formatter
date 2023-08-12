#!/bin/sh -l

# Install dependencies from your project
npm ci

# Packages the Visual Studio Code extension
vsce package

# Exports the name to the next step
name=`ls *.vsix`
echo "package_name=$name" >> $GITHUB_OUTPUT