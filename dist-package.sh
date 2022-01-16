#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DIST="$DIR/dist"
DIST_OUT="$DIST/out"
DIST_PKG="$DIST/package"

#
# Function that is invoked when the script fails.
#
# $1 - The message to display prior to exiting.
#
function fail() {
    echo $1
    echo "Exiting."
    cd $DIR
    exit 1
}

## 
## create package directories
##
if [ -d "$DIST_PKG" ]; then
    rm -r "$DIST_PKG" || { fail 'Error removing dist package directory.'; }
fi
mkdir -p "$DIST_PKG" || { fail 'Error creating dist package directory.'; }

##
## Pull and extract the simple landing page
##
cd "$DIST_PKG" || { fail 'Unable to change to package directory.'; }
wget -O - https://webrcade.github.io/webrcade-utils/landing.zip > landing.zip || 
    { fail 'Unable to retrieve landing page.'; }
unzip ./landing.zip || { fail 'Unable to extract landing page.'; }
rm -f ./landing.zip || { fail 'Unable to remove landing archive.'; }
cd "$DIR"

## 
## Copy output
##
cp -R "$DIST_OUT" "$DIST_PKG/play" || { fail 'Unable to copy output.'; }

##
## Package it
##
zip -r  "$DIST/webrcade-dist.zip" "$DIST_PKG/."  || { fail 'Unable to package output.'; }
