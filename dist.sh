#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DIST="$DIR/dist"
DIST_OUT="$DIST/out"
DIST_OUT_APP="$DIST_OUT/app"

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
## create output directories
##
if [ -d "$DIST_OUT" ]; then
    rm -r "$DIST_OUT" || { fail 'Error removing dist output directory.'; }
fi
mkdir -p "$DIST_OUT" || { fail 'Error creating dist output directory.'; }

 # copy the default feed
node copy-default-feed.js || { fail 'Error copying default feed.'; }

##
## common
##

cd "$DIR/../webrcade-app-common" || { fail 'Unable to change to common.'; }
npm install  . || { fail 'Unable to install common dependencies.'; }
npm run build || { fail 'Unable to build common.'; }
npm link || { fail 'Unable to make common linkable.'; }

##
## webrcade
##

cd "$DIR" || { fail 'Unable to change to webrcade.'; }
# dats
cd public || { fail 'Unable to change to public.'; }
UTILS="../../webrcade-utils"
mkdir -p "$UTILS" || { fail "Unable to create utils dir"}
cd "$UTILS" || { fail "Unable to change to utils dir"}
npm install archiver || { fail 'Unable to install archiver.'; }
wget -O - https://webrcade.github.io/webrcade-utils/createdats-fbneo.js > createdats-fbneo.js ||
    { fail 'Unable to retrieve create fbneo dats.'; }
wget -O - https://webrcade.github.io/webrcade-utils/createdats.js > createdats.js ||
    { fail 'Unable to retrieve create dats.'; }
cd "$DIR" || { fail 'Unable to change to webrcade.'; }
cd public || { fail 'Unable to change to public.'; }
node "$UTILS/createdats-fbneo.js" || { fail 'Unable to execute create dats fbneo.'; }
node "$UTILS/createdats.js" || { fail 'Unable to execute create dats.'; }
rm "$UTILS/createdats-fbneo.js" || { fail 'Unable remove create dats fbneo.'; }
rm "$UTILS/createdats.js" || { fail 'Unable remove create dats.'; }
cd "$DIR" || { fail 'Unable to change to webrcade.'; }
# build
npm install . || { fail 'Unable to install webrcade dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build webrcade.'; }
cp -R build/. "$DIST_OUT" || { fail 'failed to copy to out.'; }

##
## webrcade-app-snes9x
##

cd "$DIR/../webrcade-app-snes9x" || { fail 'Unable to change to snes9x.'; }
npm install . || { fail 'Unable to install snes9x dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build snes9x.'; }
mkdir -p "$DIST_OUT_APP/snes"  || { fail 'Error creating snes output directory.'; }
cp -R build/. "$DIST_OUT_APP/snes" || { fail 'failed to copy snes to out.'; }

##
## webrcade-app-genplusgx
##

cd "$DIR/../webrcade-app-genplusgx" || { fail 'Unable to change to genplusgx.'; }
npm install . || { fail 'Unable to install genplusgx dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build genplusgx.'; }
mkdir -p "$DIST_OUT_APP/genesis"  || { fail 'Error creating genesis output directory.'; }
cp -R build/. "$DIST_OUT_APP/genesis" || { fail 'failed to copy genesis to out.'; }

##
## webrcade-app-javatari
##

cd "$DIR/../webrcade-app-javatari" || { fail 'Unable to change to javatari.'; }
npm install . || { fail 'Unable to install javatari dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build javatari.'; }
mkdir -p "$DIST_OUT_APP/2600"  || { fail 'Error creating 2600 output directory.'; }
cp -R build/. "$DIST_OUT_APP/2600" || { fail 'failed to copy 2600 to out.'; }

##
## webrcade-app-js7800
##

cd "$DIR/../webrcade-app-js7800" || { fail 'Unable to change to js7800.'; }
npm install . || { fail 'Unable to install js7800 dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build js7800.'; }
mkdir -p "$DIST_OUT_APP/7800"  || { fail 'Error creating 7800 output directory.'; }
cp -R build/. "$DIST_OUT_APP/7800" || { fail 'failed to copy 7800 to out.'; }

##
## webrcade-app-fceux
##

cd "$DIR/../webrcade-app-fceux" || { fail 'Unable to change to fceux.'; }
npm install . || { fail 'Unable to install fceux dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build fceux.'; }
mkdir -p "$DIST_OUT_APP/nes"  || { fail 'Error creating nes output directory.'; }
cp -R build/. "$DIST_OUT_APP/nes" || { fail 'failed to copy nes to out.'; }

##
## webrcade-app-vba-m
##

cd "$DIR/../webrcade-app-vba-m" || { fail 'Unable to change to vba-m.'; }
npm install . || { fail 'Unable to install vba-m dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build vba-m.'; }
mkdir -p "$DIST_OUT_APP/gba"  || { fail 'Error creating gba output directory.'; }
cp -R build/. "$DIST_OUT_APP/gba" || { fail 'failed to copy gba to out.'; }

##
## webrcade-app-mednafen
##

cd "$DIR/../webrcade-app-mednafen" || { fail 'Unable to change to mednafen.'; }
npm install . || { fail 'Unable to install mednafen dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build mednafen.'; }
mkdir -p "$DIST_OUT_APP/mednafen"  || { fail 'Error creating mednafen output directory.'; }
cp -R build/. "$DIST_OUT_APP/mednafen" || { fail 'failed to copy mednafen to out.'; }

##
## webrcade-app-fbneo
##

cd "$DIR/../webrcade-app-fbneo" || { fail 'Unable to change to fbneo.'; }
npm install . || { fail 'Unable to install fbneo dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build fbneo.'; }
mkdir -p "$DIST_OUT_APP/neo"  || { fail 'Error creating fbneo output directory.'; }
cp -R build/. "$DIST_OUT_APP/neo" || { fail 'failed to copy mednafen to out.'; }

##
## webrcade-app-prboom
##

if test -d "$DIR/../webrcade-app-prboom"; then
    cd "$DIR/../webrcade-app-prboom" || { fail 'Unable to change to prboom.'; }
    npm install . || { fail 'Unable to install prboom dependencies.'; }
    npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
    npm run build || { fail 'Unable to build prboom.'; }
    mkdir -p "$DIST_OUT_APP/doom"  || { fail 'Error creating doom output directory.'; }
    cp -R build/. "$DIST_OUT_APP/doom" || { fail 'failed to copy doom to out.'; }
fi

##
## webrcade-editor
##

cd "$DIR/../webrcade-editor" || { fail 'Unable to change to editor.'; }
npm install . || { fail 'Unable to install editor dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build editor.'; }
mkdir -p "$DIST_OUT_APP/editor"  || { fail 'Error creating editor output directory.'; }
cp -R build/. "$DIST_OUT_APP/editor" || { fail 'failed to copy editor to out.'; }
