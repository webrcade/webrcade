## Change log

### 06/07/22 (0.0.4.0)
    - FBNeo support, 6907 games total, (Neo Geo, Capcom, Konami, etc.)
      - Neo Geo:
        - BIOS Selection (per item and globally)
        - Selecting between AES (console) and MVS (arcade) hardware
      - Save persistence (High scores, settings, memory cards, etc.)
      - Support for specifying audio samples for games that support it
      - Default SRAM (NVRAM) for games that require it (Williams, etc.)
      - Games with analog or unique control schemes (twin stick, etc.) custom
        mapped to gamepads (~200 custom mappings)
      - Controller screen in pause menu that shows gamepad and keyboard
        mappings
    - Last game launched stored in session (will return to game in webRcade
      player if browser refreshed)
    - Fixes for iOS display glitches in webRcade player
    - Ability to select from files in Dropbox at all applicable fields in
      webRcade editor

### 05/18/22 (0.0.3.2)
    -  Resolve application redirects (caused reload of previous game)

### 03/30/22 (0.0.3.1)
    -  Additional GBA save game fixes

### 03/18/22 (0.0.3)
    - Added the following application (emulator):
      - Atari Lynx
    - New implementation of NES display layer
    - Adjusted Atari 7800 screen sizes
    - GBA save game fixes
    - Editor categories tab now supports copy/paste (including between feeds)

### 02/21/22 (0.0.2)
    - Added the following applications (emulators):
      - Bandai WonderSwan
      - Bandai WonderSwan Color
      - NEC PC Engine (TurboGrafx-16)
      - NEC SuperGrafx
      - Neo Geo Pocket
      - Neo Geo Pocket Color
      - Nintendo Virtual Boy

### 01/20/22 (0.0.1)
    - Automatic VSync disable if unable to maintain frame rate
    - Fixed Android rotation issue when added to home screen
    - Added automatic URL remapping for Google Drive and Dropbox (no longer necessary to manually modify URLs)
    - Moved default feed to its own GitHub repository (old URLs should remap automatically)
    - Refactored code to support GitHub CI, Docker, and build-related files
    - Added Multitap support for SNES (Snes9x)
    - Added CHANGELOG file
    - Added VERSION file

### 01/08/22 (0.0.0)
    - Initial release
