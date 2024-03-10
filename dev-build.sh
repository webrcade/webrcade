#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DIST="$DIR/dist"
DIST_OUT="$DIST/out"
DIST_OUT_APP="$DIST_OUT/app"
UTILS="$DIR/webrcade-utils"
mkdir public
echo THIS MUST BE RUN AS SUDO
echo

#
# Function that is invoked when the script fails.
#
# $1 - The message to display prior to exiting.
#
function fail() {
    echo $1
    cd $DIR
    echo -n "Continue with build? (y/n)?"
    read SKIPPROMPT
    case $SKIPPROMPT in
      y)
        ;;
      n)
        read -p "Press any key to exit ..."
        exit 1
        ;;
    esac
}

function common() {
  git clone https://github.com/webrcade/webrcade-app-common.git ||
    { fail 'Unable to clone common'; }
  ##
  ## common
  ##

  cd "$DIR/webrcade-app-common" || { fail 'Unable to change to common.'; }
  npm install  . || { fail 'Unable to install common dependencies.'; }
  npm run build || { fail 'Unable to build common.'; }
  npm link || { fail 'Unable to make common linkable.'; }
}

function webrcadeSetup() {
  ##
  ## create output directories
  ##
  if [ -d "$DIST_OUT" ]; then
      rm -r "$DIST_OUT" || { fail 'Error removing dist output directory.'; }
  fi
  mkdir -p "$DIST_OUT" || { fail 'Error creating dist output directory.'; }

  # copy the default feed
  node copy-default-feed.js || { fail 'Error copying default feed.'; }

  # setup common
  common

  ##
  ## webrcade
  ##

  cd "$DIR" || { fail 'Unable to change to webrcade.'; }
  # dats
  cd public || { fail 'Unable to change to public.'; }
  mkdir -p "$UTILS" || { fail "Unable to create utils dir"; }
  cd "$UTILS" || { fail "Unable to change to utils dir"; }
  npm install archiver || { fail 'Unable to install archiver.'; }
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

  wget -O - https://webrcade.github.io/webrcade-utils/cors.php > $DIST_OUT/cors.php
}

function editor() {
  git clone https://github.com/webrcade/webrcade-editor.git ||
    { fail 'Unable to clone editor'; }
  ##
  ## webrcade-editor
  ##

  cd "$DIR/webrcade-editor" || { fail 'Unable to change to editor.'; }
  npm install . || { fail 'Unable to install editor dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build editor.'; }
  mkdir -p "$DIST_OUT_APP/editor"  || { fail 'Error creating editor output directory.'; }
  cp -R build/. "$DIST_OUT_APP/editor" || { fail 'failed to copy editor to out.'; }
}

function snes9x() {
  git clone https://github.com/webrcade/webrcade-app-snes9x.git ||
    { fail 'Unable to clone snes9x'; }
  ##
  ## webrcade-app-snes9x
  ##

  cd "$DIR/webrcade-app-snes9x" || { fail 'Unable to change to snes9x.'; }
  npm install . || { fail 'Unable to install snes9x dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build snes9x.'; }
  mkdir -p "$DIST_OUT_APP/snes"  || { fail 'Error creating snes output directory.'; }
  cp -R build/. "$DIST_OUT_APP/snes" || { fail 'failed to copy snes to out.'; }
}

function genplusgx() {
  git clone https://github.com/webrcade/webrcade-app-genplusgx.git ||
    { fail 'Unable to clone genplusgx'; }
  ##
  ## webrcade-app-genplusgx
  ##

  cd "$DIR/webrcade-app-genplusgx" || { fail 'Unable to change to genplusgx.'; }
  npm install . || { fail 'Unable to install genplusgx dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build genplusgx.'; }
  mkdir -p "$DIST_OUT_APP/genesis"  || { fail 'Error creating genesis output directory.'; }
  cp -R build/. "$DIST_OUT_APP/genesis" || { fail 'failed to copy genesis to out.'; }
}

function javatari() {
  git clone https://github.com/webrcade/webrcade-app-javatari.git ||
    { fail 'Unable to clone javatari'; }
  ##
  ## webrcade-app-javatari
  ##

  cd "$DIR/webrcade-app-javatari" || { fail 'Unable to change to javatari.'; }
  npm install . || { fail 'Unable to install javatari dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build javatari.'; }
  mkdir -p "$DIST_OUT_APP/2600"  || { fail 'Error creating 2600 output directory.'; }
  cp -R build/. "$DIST_OUT_APP/2600" || { fail 'failed to copy 2600 to out.'; }
}

function js7800() {
  git clone https://github.com/webrcade/webrcade-app-js7800.git ||
    { fail 'Unable to clone js7800'; }
  ##
  ## webrcade-app-js7800
  ##

  cd "$DIR/webrcade-app-js7800" || { fail 'Unable to change to js7800.'; }
  npm install . || { fail 'Unable to install js7800 dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build js7800.'; }
  mkdir -p "$DIST_OUT_APP/7800"  || { fail 'Error creating 7800 output directory.'; }
  cp -R build/. "$DIST_OUT_APP/7800" || { fail 'failed to copy 7800 to out.'; }
}

function fceux() {
  git clone https://github.com/webrcade/webrcade-app-fceux.git ||
    { fail 'Unable to clone fceux'; }
  ##
  ## webrcade-app-fceux
  ##

  cd "$DIR/webrcade-app-fceux" || { fail 'Unable to change to fceux.'; }
  npm install . || { fail 'Unable to install fceux dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build fceux.'; }
  mkdir -p "$DIST_OUT_APP/nes"  || { fail 'Error creating nes output directory.'; }
  cp -R build/. "$DIST_OUT_APP/nes" || { fail 'failed to copy nes to out.'; }
}

function vba-m() {
  git clone https://github.com/webrcade/webrcade-app-vba-m.git ||
    { fail 'Unable to clone vba-m'; }
  ##
  ## webrcade-app-vba-m
  ##

  cd "$DIR/webrcade-app-vba-m" || { fail 'Unable to change to vba-m.'; }
  npm install . || { fail 'Unable to install vba-m dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build vba-m.'; }
  mkdir -p "$DIST_OUT_APP/gba"  || { fail 'Error creating gba output directory.'; }
  cp -R build/. "$DIST_OUT_APP/gba" || { fail 'failed to copy gba to out.'; }
}

function mednafen() {
  git clone https://github.com/webrcade/webrcade-app-mednafen.git ||
    { fail 'Unable to clone mednafen'; }
  ##
  ## webrcade-app-mednafen
  ##

  cd "$DIR/webrcade-app-mednafen" || { fail 'Unable to change to mednafen.'; }
  npm install . || { fail 'Unable to install mednafen dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build mednafen.'; }
  mkdir -p "$DIST_OUT_APP/mednafen"  || { fail 'Error creating mednafen output directory.'; }
  cp -R build/. "$DIST_OUT_APP/mednafen" || { fail 'failed to copy mednafen to out.'; }
}

function fbneo() {
  git clone https://github.com/webrcade/webrcade-app-fbneo.git ||
    { fail 'Unable to clone fbneo'; }
  ##
  ## webrcade-app-fbneo
  ##

  cd "$DIR/webrcade-app-fbneo" || { fail 'Unable to change to fbneo.'; }
  npm install . || { fail 'Unable to install fbneo dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build fbneo.'; }
  mkdir -p "$DIST_OUT_APP/neo"  || { fail 'Error creating fbneo output directory.'; }
  cp -R build/. "$DIST_OUT_APP/neo" || { fail 'failed to copy fbneo to out.'; }
}

function parallelN64() {
  git clone https://github.com/webrcade/webrcade-app-parallel-n64.git ||
    { fail 'Unable to clone parallel-n64'; }
  ##
  ## webrcade-app-parallel-n64
  ##

  cd "$DIR/webrcade-app-parallel-n64" || { fail 'Unable to change to n64.'; }
  npm install . || { fail 'Unable to install n64 dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build n64.'; }
  mkdir -p "$DIST_OUT_APP/n64"  || { fail 'Error creating n64 output directory.'; }
  cp -R build/. "$DIST_OUT_APP/n64" || { fail 'failed to copy n64 to out.'; }
}

function beetlePSX() {
  git clone https://github.com/webrcade/webrcade-app-beetle-psx.git ||
    { fail 'Unable to clone beetle-psx'; }
  ##
  ## webrcade-app-beetle-psx
  ##

  cd "$DIR/webrcade-app-beetle-psx" || { fail 'Unable to change to beetle-psx.'; }
  npm install . || { fail 'Unable to install beetle-psx dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build psx.'; }
  mkdir -p "$DIST_OUT_APP/psx"  || { fail 'Error creating psx output directory.'; }
  cp -R build/. "$DIST_OUT_APP/psx" || { fail 'failed to copy psx to out.'; }
}

function prboom() {
  git clone https://github.com/webrcade/webrcade-app-prboom.git ||
    { fail 'Unable to clone prboom'; }
  ##
  ## webrcade-app-prboom
  ##
    cd "$DIR/webrcade-app-prboom" || { fail 'Unable to change to prboom.'; }
    npm install . || { fail 'Unable to install prboom dependencies.'; }
    npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
    npm run build || { fail 'Unable to build prboom.'; }
    mkdir -p "$DIST_OUT_APP/doom"  || { fail 'Error creating doom output directory.'; }
    cp -R build/. "$DIST_OUT_APP/doom" || { fail 'failed to copy doom to out.'; }
}

function retro-genplusgx() {
  git clone https://github.com/webrcade/webrcade-app-retro-genplusgx.git ||
    { fail 'Unable to clone retro-genplusgx'; }
  ##
  ## webrcade-app-retro-genplusgx
  ##
  cd "$DIR/webrcade-app-retro-genplusgx" || { fail 'Unable to change to retro-genplusgx.'; }
  npm install . || { fail 'Unable to install retro-genplusgx dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build retro-genplusgx.'; }
  mkdir -p "$DIST_OUT_APP/retro-genesis"  || { fail 'Error creating retro-genplusgx output directory.'; }
  cp -R build/. "$DIST_OUT_APP/retro-genesis" || { fail 'failed to copy retro-genplusgx to out.'; }
}

function standalone() {
  git clone https://github.com/webrcade/webrcade-app-standalone.git ||
    { fail 'Unable to clone standalone'; }
  ##
  ## webrcade-standalone
  ##

  cd "$DIR/webrcade-app-standalone" || { fail 'Unable to change to standalone.'; }
  npm install . || { fail 'Unable to install standalone dependencies.'; }
  npm link "@webrcade/app-common" || { fail 'Unable to link common.'; }
  npm run build || { fail 'Unable to build standalone.'; }
  mkdir -p "$DIST_OUT_APP/standalone"  || { fail 'Error creating standalone output directory.'; }
  cp -R build/. "$DIST_OUT_APP/standalone" || { fail 'failed to copy standalone to out.'; }
}

# Multi-selection menu
function multiselect() {

    # little helpers for terminal print control and key input
    ESC=$( printf "\033")
    cursor_blink_on()   { printf "$ESC[?25h"; }
    cursor_blink_off()  { printf "$ESC[?25l"; }
    cursor_to()         { printf "$ESC[$1;${2:-1}H"; }
    print_inactive()    { printf "$2   $1 "; }
    print_active()      { printf "$2  $ESC[7m $1 $ESC[27m"; }
    get_cursor_row()    { IFS=';' read -sdR -p $'\E[6n' ROW COL; echo ${ROW#*[}; }
    key_input()         {
      local key
      IFS= read -rsn1 key 2>/dev/null >&2
      if [[ $key = ""      ]]; then echo enter; fi;
      if [[ $key = $'\x20' ]]; then echo space; fi;
      if [[ $key = $'\x1b' ]]; then
        read -rsn2 key
        if [[ $key = [A ]]; then echo up;    fi;
        if [[ $key = [B ]]; then echo down;  fi;
      fi 
    }
    toggle_option()    {
      local arr_name=$1
      eval "local arr=(\"\${${arr_name}[@]}\")"
      local option=$2
      if [[ ${arr[option]} == true ]]; then
        arr[option]=
      else
        arr[option]=true
      fi
      eval $arr_name='("${arr[@]}")'
    }

    local retval=$1
    local options
    local defaults

    IFS=';' read -r -a options <<< "$2"
    if [[ -z $3 ]]; then
      defaults=()
    else
      IFS=';' read -r -a defaults <<< "$3"
    fi
    local selected=()

    for ((i=0; i<${#options[@]}; i++)); do
      selected+=("${defaults[i]}")
      printf "\n"
    done

    # determine current screen position for overwriting the options
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - ${#options[@]}))

    # ensure cursor and input echoing back on upon a ctrl+c during read -s
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off

    local active=0
    while true; do
        # print options by overwriting the last lines
        local idx=0
        for option in "${options[@]}"; do
            local prefix="[ ]"
            if [[ ${selected[idx]} == true ]]; then
              prefix="[x]"
            fi

            cursor_to $(($startrow + $idx))
            if [ $idx -eq $active ]; then
                print_active "$option" "$prefix"
            else
                print_inactive "$option" "$prefix"
            fi
            ((idx++))
        done

        # user key control
        case `key_input` in
            space)  toggle_option selected $active;;
            enter)  break;;
            up)     ((active--));
                    if [ $active -lt 0 ]; then active=$((${#options[@]} - 1)); fi;;
            down)   ((active++));
                    if [ $active -ge ${#options[@]} ]; then active=0; fi;;
        esac
    done

    # cursor position back to normal
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on

    eval $retval='("${selected[@]}")'
}

# multiselect outputArray "option1;option2" "defaultvalue1;defaultvalue2"
echo "Select which apps to install:"
multiselect result "editor;snes9x;genplusgx;javatari;js7800;fceux;vba-m;mednafen;fbneo;parallelN64;beetlePSX;prboom;retro-genplusgx;standalone" "false;false;false;false;false;false;false;false;false;false;false;false;false;false"

# Array of apps (must match 'multiselect')
apps=("editor" "snes9x" "genplusgx" "javatari" "js7800" "fceux" "vba-m" "mednafen" "fbneo" "parallelN64" "beetlePSX" "prboom" "retro-genplusgx" "standalone")

# Call the setup function for selected apps
for ((i=0; i<${#result[@]}; i++)); do
  if [ "${result[i]}" = "true" ] ; then
    webrcadeSetup
    x="${apps[$i]}"
    $x
  fi
done

read -p "Press any key to exit ..."
