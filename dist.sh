#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DIST="$DIR/dist"
DIST_OUT="$DIST/out"
DIST_OUT_APP="$DIST_OUT/app"
UTILS="$DIR/../webrcade-utils"

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
mkdir -p "$UTILS" || { fail "Unable to create utils dir"; }
cd "$UTILS" || { fail "Unable to change to utils dir"; }
npm install archiver@6.0.2 || { fail 'Unable to install archiver.'; }
wget -O - https://webrcade.github.io/webrcade-utils/roms-scummvm.json > roms-scummvm.json ||
    { fail 'Unable to retrieve scummvm info.'; }
wget -O - https://webrcade.github.io/webrcade-utils/createdats-fbneo.js > createdats-fbneo.js ||
    { fail 'Unable to retrieve create fbneo dats.'; }
wget -O - https://webrcade.github.io/webrcade-utils/createdats.js > createdats.js ||
    { fail 'Unable to retrieve create dats.'; }
cd "$DIR" || { fail 'Unable to change to webrcade.'; }
cd public || { fail 'Unable to change to public.'; }
node "$UTILS/createdats-fbneo.js" || { fail 'Unable to execute create dats fbneo.'; }
cp "roms-fbneo.json" "$UTILS" || { fail 'Unable to copy roms-fbneo.json'; }
node "$UTILS/createdats.js" || { fail 'Unable to execute create dats.'; }
rm -rf "$UTILS" || { fail 'Unable remove utils directory.'; }
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
## webrcade-app-parallel-n64
##

cd "$DIR/../webrcade-app-parallel-n64" || { fail 'Unable to change to n64.'; }
npm install . || { fail 'Unable to install n64 dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build n64.'; }
mkdir -p "$DIST_OUT_APP/n64"  || { fail 'Error creating n64 output directory.'; }
cp -R build/. "$DIST_OUT_APP/n64" || { fail 'failed to copy n64 to out.'; }

##
## webrcade-app-fbneo
##

cd "$DIR/../webrcade-app-fbneo" || { fail 'Unable to change to fbneo.'; }
npm install . || { fail 'Unable to install fbneo dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build fbneo.'; }
mkdir -p "$DIST_OUT_APP/neo"  || { fail 'Error creating fbneo output directory.'; }
cp -R build/. "$DIST_OUT_APP/neo" || { fail 'failed to copy fbneo to out.'; }

##
## webrcade-app-beetle-psx
##

cd "$DIR/../webrcade-app-beetle-psx" || { fail 'Unable to change to beetle-psx.'; }
npm install . || { fail 'Unable to install beetle-psx dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build psx.'; }
mkdir -p "$DIST_OUT_APP/psx"  || { fail 'Error creating psx output directory.'; }
cp -R build/. "$DIST_OUT_APP/psx" || { fail 'failed to copy psx to out.'; }

##
## webrcade-app-retro-genplusgx
##

cd "$DIR/../webrcade-app-retro-genplusgx" || { fail 'Unable to change to retro-genplusgx.'; }
npm install . || { fail 'Unable to install retro-genplusgx dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro-genplusgx.'; }
mkdir -p "$DIST_OUT_APP/retro-genesis"  || { fail 'Error creating retro-genplusgx output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-genesis" || { fail 'failed to copy retro-genplusgx to out.'; }

##
## webrcade-app-retro-pce-fast
##

cd "$DIR/../webrcade-app-retro-pce-fast" || { fail 'Unable to change to retro-pce-fast.'; }
npm install . || { fail 'Unable to install retro-pce-fast dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro-pce-fast.'; }
mkdir -p "$DIST_OUT_APP/retro-pce-fast"  || { fail 'Error creating retro-pce-fast output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-pce-fast" || { fail 'failed to copy retro-pce-fast to out.'; }

##
## webrcade-app-colem
##

cd "$DIR/../webrcade-app-colem" || { fail 'Unable to change to colem.'; }
npm install . || { fail 'Unable to install colem dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build colem.'; }
mkdir -p "$DIST_OUT_APP/colem"  || { fail 'Error creating colem output directory.'; }
cp -R build/. "$DIST_OUT_APP/colem" || { fail 'failed to copy colem to out.'; }

##
## webrcade-app-beetle-pcfx
##

cd "$DIR/../webrcade-app-beetle-pcfx" || { fail 'Unable to change to beetle-pcfx.'; }
npm install . || { fail 'Unable to install beetle-pcfx dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build beetle-pcfx.'; }
mkdir -p "$DIST_OUT_APP/pcfx"  || { fail 'Error creating beetle-pcfx output directory.'; }
cp -R build/. "$DIST_OUT_APP/pcfx" || { fail 'failed to copy beetle-pcfx to out.'; }

##
## webrcade-app-retro-a5200
##

cd "$DIR/../webrcade-app-retro-a5200" || { fail 'Unable to change to retro-a5200.'; }
npm install . || { fail 'Unable to install retro-a5200 dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro-a5200.'; }
mkdir -p "$DIST_OUT_APP/retro-a5200"  || { fail 'Error creating retro-a5200 output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-a5200" || { fail 'failed to copy retro-a5200 to out.'; }

##
## webrcade-app-retro-neocd
##

cd "$DIR/../webrcade-app-retro-neocd" || { fail 'Unable to change to retro-neocd.'; }
npm install . || { fail 'Unable to install retro-neocd dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro-neocd.'; }
mkdir -p "$DIST_OUT_APP/retro-neocd"  || { fail 'Error creating retro-neocd output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-neocd" || { fail 'failed to copy retro-neocd to out.'; }

##
## webrcade-app-retro-opera
##

cd "$DIR/../webrcade-app-retro-opera" || { fail 'Unable to change to retro-opera.'; }
npm install . || { fail 'Unable to install retro-opera dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro-opera.'; }
mkdir -p "$DIST_OUT_APP/3do"  || { fail 'Error creating retro-neocd output directory.'; }
cp -R build/. "$DIST_OUT_APP/3do" || { fail 'failed to copy retro-neocd to out.'; }

##
## webrcade-app-tyrquake
##

cd "$DIR/../webrcade-app-tyrquake" || { fail 'Unable to change to quake.'; }
npm install . || { fail 'Unable to install quake dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build quake.'; }
mkdir -p "$DIST_OUT_APP/quake"  || { fail 'Error creating quake output directory.'; }
cp -R build/. "$DIST_OUT_APP/quake" || { fail 'failed to copy quake to out.'; }

##
## webrcade-app-retro-stella-2014
##

cd "$DIR/../webrcade-app-retro-stella-2014" || { fail 'Unable to change to retro stella 2014.'; }
npm install . || { fail 'Unable to install retro stella 2014 dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro 2014 stella.'; }
mkdir -p "$DIST_OUT_APP/retro-stella"  || { fail 'Error creating retro stella 2014 output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-stella" || { fail 'failed to copy retro stella 2014 to out.'; }

##
## webrcade-app-retro-stella
##

cd "$DIR/../webrcade-app-retro-stella" || { fail 'Unable to change to retro stella.'; }
npm install . || { fail 'Unable to install retro stella dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build retro stella.'; }
mkdir -p "$DIST_OUT_APP/retro-stella-latest"  || { fail 'Error creating retro stella output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-stella-latest" || { fail 'failed to copy retro stella to out.'; }

##
## webrcade-app-scummvm
##

cd "$DIR/../webrcade-app-scummvm" || { fail 'Unable to change to scummvm.'; }
npm install . || { fail 'Unable to install scummvm dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build scummvm.'; }
mkdir -p "$DIST_OUT_APP/scummvm"  || { fail 'Error creating scummvm output directory.'; }
cp -R build/. "$DIST_OUT_APP/scummvm" || { fail 'failed to copy scummvm to out.'; }

##
## webrcade-app-retro-commodore-8bit
##
cd "$DIR/../webrcade-app-retro-commodore-8bit" || { fail 'Unable to change to commodore 8bit.'; }
npm install . || { fail 'Unable to install scummvm dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build scummvm.'; }
mkdir -p "$DIST_OUT_APP/retro-commodore-8bit"  || { fail 'Error creating commodore 8bit output directory.'; }
cp -R build/. "$DIST_OUT_APP/retro-commodore-8bit" || { fail 'failed to copy commodore 8bit to out.'; }

IF %ERRORLEVEL% NEQ 0 (
   Echo "Error."
   EXIT /B
)

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

##
## webrcade-standalone
##

cd "$DIR/../webrcade-app-standalone" || { fail 'Unable to change to standalone.'; }
npm install . || { fail 'Unable to install standalone dependencies.'; }
npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
npm run build || { fail 'Unable to build standalone.'; }
mkdir -p "$DIST_OUT_APP/standalone"  || { fail 'Error creating standalone output directory.'; }
cp -R build/. "$DIST_OUT_APP/standalone" || { fail 'failed to copy standalone to out.'; }
