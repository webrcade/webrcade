#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DIST="$DIR/dist"
DIST_OUT="$DIST/out"
VERSION_FILE_DEST="$DIST_OUT/public/VERSION"

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

cp ./VERSION "$VERSION_FILE_DEST" || { fail 'Unable to copy version file.'; }
echo "$1" >> "$VERSION_FILE_DEST" || { fail 'Unable to set context.'; }
echo $(date) >> "$VERSION_FILE_DEST" || { fail 'Unable to set date.'; }
