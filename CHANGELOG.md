## Change log

### 09/20/22 (0.0.5.1)
    - Nintendo 64
      - Warning dialog for devices running iOS 16 (performance issues)
      - Refers to documentation with instructions to disable Safari experimental
        feature (GPU Process: WebGL) to restore performance.

### 09/17/22 (0.0.5)
    - Support for cloud-based in-games saves (Dropbox)
    - Export/import feeds with zip and base64
    - Settings editor now available in the upper-right corner of the webrcade
      player and editor
      - Display settings:
        - Enable/disable vertical sync (enabled by default)
        - Enable/disable bilinear filter (disabled by default)
      - Cloud Storage:
        - Enable/disable and link to Dropbox
      - Advanced settings:
        - Enable/disable experimental apps (disabled by default)
          - Allows for early public access to applications (emulators, etc.)
            not ready for a broad release
          - For example: stability and compatibility issues, high resource
            requirements (N64, etc.)
        - Hide the webrcade title bar (adds more vertical space in player
          front-end)
    - Nintendo 64:
      - Very early version that requires enabling "experimental" applications
        in settings
      - Requires modern PC/Mac or newer iPad/iPhone 11+ (Android currently too
        slow due to low single core performance)
      - Games with compatibility issues will present a dialog with details when
        loaded
      - Ability to scale screen for individual games
      - Keyboard support
    - Stand-alone links (shareable direct links to games)
      - The editor now provides the ability to generate a stand-alone link to a
        game (without displaying the player or the editor)
        - To use:
          - Select a single item (game, etc.) in the editor
          - Go to the additional items in the toolbar ("...")
          - Select "Copy stand-alone link" (The link will be copied to the
            clipboard)
      - Stand-alone links can be added to the iPhone/Android home screens
        - Game-specific shortcuts on the home screen
        - Includes thumbnail image and title
    - Arcade (FBNeo):
      - World Rally 2 forced to single screen
      - Custom mapping for Toobin'
      - Custom mapping for Eco Fighter
      - Custom mapping for Ultimate Mortal Kombat 3
    - Editor
      - Full screen mode when added to the home screen on mobile
      - Modified the breakpoints of the editor. So now, even in landscape on a
        phone, the left navigation drawer will be hidden giving much more
        horizontal space. This makes navigating the editor on the phone much
        easier and is now a decent alternative to the player.
    - Ability to View Control mappings (gamepad/keyboard) for all applications
      (emulators, etc.) via the application's pause menu
    - Full screen webrcade on Android home screen (PR#53, jaycliff)
    - Bundled SVG icons
    - Bug fixes
      - URL remapping defect in editor (Dropbox, etc.)
      - Google Drive issue where certain files would not download
      - Button colors within the webrcade player on Macos
      - Updated content-disposition parsing

### 06/07/22 (0.0.4)
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
    - Added automatic URL remapping for Google Drive and Dropbox (no longer
      necessary to manually modify URLs)
    - Moved default feed to its own GitHub repository (old URLs should remap
      automatically)
    - Refactored code to support GitHub CI, Docker, and build-related files
    - Added Multitap support for SNES (Snes9x)
    - Added CHANGELOG file
    - Added VERSION file

### 01/08/22 (0.0.0)
    - Initial release
