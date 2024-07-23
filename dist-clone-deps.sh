#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
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

# Clone dependencies
git clone https://github.com/webrcade/webrcade-app-common.git ||
  { fail 'Unable to clone common'; }
git clone https://github.com/webrcade/webrcade-editor.git ||
  { fail 'Unable to clone editor'; }
git clone https://github.com/webrcade/webrcade-app-snes9x.git ||
  { fail 'Unable to clone snes9x'; }
git clone https://github.com/webrcade/webrcade-app-genplusgx.git ||
  { fail 'Unable to clone genplusgx'; }
git clone https://github.com/webrcade/webrcade-app-javatari.git ||
  { fail 'Unable to clone javatari'; }
git clone https://github.com/webrcade/webrcade-app-js7800.git ||
  { fail 'Unable to clone js7800'; }
git clone https://github.com/webrcade/webrcade-app-fceux.git ||
  { fail 'Unable to clone fceux'; }
git clone https://github.com/webrcade/webrcade-app-vba-m.git ||
  { fail 'Unable to clone vba-m'; }
git clone https://github.com/webrcade/webrcade-app-mednafen.git ||
  { fail 'Unable to clone mednafen'; }
git clone https://github.com/webrcade/webrcade-app-fbneo.git ||
  { fail 'Unable to clone fbneo'; }
git clone https://github.com/webrcade/webrcade-app-parallel-n64.git ||
  { fail 'Unable to clone parallel-n64'; }
git clone https://github.com/webrcade/webrcade-app-beetle-psx.git ||
  { fail 'Unable to clone beetle-psx'; }
git clone https://github.com/webrcade/webrcade-app-retro-genplusgx.git ||
  { fail 'Unable to clone retro-genplusgx'; }
git clone https://github.com/webrcade/webrcade-app-retro-pce-fast.git ||
  { fail 'Unable to clone retro-pce-fast'; }
git clone https://github.com/webrcade/webrcade-app-colem.git ||
  { fail 'Unable to clone colem'; }
git clone https://github.com/webrcade/webrcade-app-beetle-pcfx.git ||
  { fail 'Unable to clone beetle-pcfx'; }
git clone https://github.com/webrcade/webrcade-app-retro-a5200.git ||
  { fail 'Unable to clone retro-a5200'; }
git clone https://github.com/webrcade/webrcade-app-retro-neocd.git ||
  { fail 'Unable to clone retro-neocd'; }
git clone https://github.com/webrcade/webrcade-app-retro-opera.git ||
  { fail 'Unable to clone retro-opera'; }
git clone https://github.com/webrcade/webrcade-app-tyrquake.git ||
  { fail 'Unable to clone quake'; }
git clone https://github.com/webrcade/webrcade-app-retro-stella-2014.git ||
  { fail 'Unable to clone retro stella 2014'; }
git clone https://github.com/webrcade/webrcade-app-retro-stella.git ||
  { fail 'Unable to clone retro stella'; }
git clone https://github.com/webrcade/webrcade-app-scummvm.git ||
  { fail 'Unable to clone scummvm'; }
git clone https://github.com/webrcade/webrcade-app-retro-commodore-8bit.git ||
  { fail 'Unable to clone scummvm'; }
git clone https://github.com/webrcade/webrcade-app-standalone.git ||
  { fail 'Unable to clone standalone'; }
