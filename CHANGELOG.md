## Change log

### 06/24/25 (0.1.8)

    - Nintendo DS
      - Touch, Mouse, and Gamepad (with Analog for stylus) support
      - Book mode support
      - Dual analog mode (for FPS-style controls with gamepad)
      - Support for multiple screen layouts and screen gap adjustment
      - On-screen microphone support
    - Editor
      - Fixed issue with copying URLs on iOS (URL dialog)
    - General
      - Feed URLs no longer require the https:// prefix
      - Fixed Safari (iOS and MacOS) issue where a blank page would appear
        after loading 2 games (in the player or editor)
      - Fix for disabling context menus on mobile (iOS)

### 01/31/25 (0.1.7)

    - DOS
      - Initial version of DOS (DOSBox Pure) support
      - Works similar to ScummVM (archive-based)
      - Compatible with Manifest format
      - Virtual Keyboard, Gamepad, and touch input support
    - Commodore 64
      - Left trigger + right analog: Toggle virtual keyboard
      - Bug fixes (disable input)
    - ScummVM
      - Left trigger + right analog: Toggle virtual keyboard
    - Arcade (FBNeo)
      - Samples fix
    - Docker image
      - HTTPS support (use own certs, or automatically generates self-signed)
    - iOS
      - Fixed full screen issue when adding to home screen

### 08/11/24 (0.1.6)

    - General
      - Google drive support for large files (200mb+)
      - Fix for Dropbox issues
    - Editor
      - Safari (iOS/Mac) fix when adding multiple files (Dropbox, etc.)
      - Commodore 64: Controller mappings
    - Nintendo 64
      - Message regarding the use of Vertex Buffers
      - Vertex Buffers (VBO) now on by default for iOS
    - Commodore 64
      - Virtual keyboard and physical keyboard support
      - Ability to auto-detect when dragging, adding (similar to ROMs)
      - Multi-disk game support
      - Save state support
      - JiffyDOS support (must provide BIOS files in feed properties)
      - Tape, Cartridge, and Disk support
      - 2 button joystick support
      - Support for "save" disks
        - Games have single save disk by default (can be adjusted to 4)
      - Changes to media (disks, carts) are persisted
        (when displaying pause screen)
      - Ability to disable autoload of media (disks, tapes, etc.)
      - Ability to mount disks when loading a cartridge, tape, etc.
      - Support for disabling True Drive Emulation (TDE)
      - Per-game controller mappings (map keys to controller, etc.)
      - Updated default feed to include public domain C64 games and demos

### 03/09/24 (0.1.5)
    - Atari 2600
      - New Stella Version (Latest)
      - The default "2600" app now uses this version (previous still available)
      - Supports latest homebrew (DPC+/CDF/ARM, etc.)
      - Default feed updated to include several new 2600 homebrew games
    - Atari 7800
      - Souper support
      - Activision OM ROM layout support
      - Pole Position II track selection fix (by RevEng @ AtariAge)
      - Tower Toppler and Jinks composite smoothing (by RevEng @ AtariAge)

### 01/18/24 (0.1.4)
    - ScummVM support
      - Touch support (direct and touchpad modes)-
      - Webrcade-specific Virtual keyboard
      - Default feed updated to include several freeware ScummVM-compatible
        games
      - Compatible with archive manifests
    - Quake
      - Updated to be compatible with archive manifests
      - Updated to support alternate pause menu key combos
    - Sony PlayStation
      - Support for .SBI files
    - Atari 7800
      - Pokey audio chip re-implementation (by RevEng @ AtariAge)
      - TIA fidelity issue fix (by RevEng @ AtariAge)
    - Editor
      - Support for repackaging archives (.zip files) into webrcade manifest
        format
      - Support for pasting multiple Google Drive URLs in multi-url text
        fields
    - General
      - Thumbnails no longer required to be 400x300
      - Archive manifest support
        - Significantly decreases browser memory use for large archive
          (.zip) files
      - Additional pause screen key combos
        - CONTROL+RETURN, CONTROL+SHIFT, ALT+RETURN, ALT+SHIFT
      - Several minor bug fixes

### 7/29/23 (0.1.3)
    - New Atari 2600 emulator (based on Stella)
      - This emulator is now the default for Atari 2600
      - The previous 2600 emulator is still available (select specific
        application in item editor).
      - This emulator introduces the following enhancements:
        - WebAssembly-based
        - Save state support
        - Improved game compatibility (graphical effects (like star fields)
          are now present in certain games).
        - Color/B&W and difficulty switches accessible via controllers and
          pause screen.
        - Paddle controller support (via gamepad analog stick)
          - Specify controller types and paddle settings in feed editor
            (game's item editor)
          - Specify joystick vs. paddle for each port (for games that support
            both paddles and joysticks simultaneously)
            - Specify paddle center and sensitivity
            - Auto-detection of paddle settings when games are added in editor
            - Inverted paddle support
    - Atari 7800
      - Save state support (including audio chips)
      - Ability to set difficulty switch settings and dual-analog in pause
        menu
      - Pause button mapped to gamepad/keyboard
      - Improved cycle accuracy (resolves several game glitches)
      - Banksets support
      - Maria background color fix
      - Cartridge headers fix
      - Pokey filter support (contributed by RevEng @ AtariAge)
      - YM-2151 auto-detect support (for homebrew carts)
      - Support for 7800 Diagnostic cartridge
    - PC-Engine CD
      - Ability to provide a custom BIOS on a game-by-game basis
    - Fixes/enhancements
      - Long term persistence in browser (more than 7 days w/o visiting)

### 7/07/23 (0.1.2.1)
    - Update to Dropbox fix

### 6/11/23 (0.1.2)
    - 3DO Support (New)
      - Requires CHD files
      - Some games require a "hack" to be set (will auto-select in editor).
      - BIOS must be specified in feed properties
    - Fixes/enhancements
      - Fix for Dropbox issue (error when adding certain files)
      - Sega CD
        - Frame rate issue adjust (reduces sound pops, primarily in FMV)
      - PC-Engine CD
        - Frame rate issue adjust (reduces sound pops, primarily in FMV)
      - PlayStation:
        - Ability to set GPU resolution (default or 2x)
          - Pause Screen > Advanced Settings > GPU Resolution
      - N64:
        - Removed WebGL performance prompt for iOS 16.5+ (the issue has been
          resolved)
      - All CD-based systems:
        - Will write game-specific saves, even after loading a save state
          (helpful for disc-swapping games)
    - Docker
      - Fixed CORS proxy

### 5/14/23 (0.1.1.1)
    - Screen sizing fix (would revert when internal aspect ratio changed)

### 5/10/23 (0.1.1)
    - Player now scales to large screen sizes (4k, etc.)
    - Screen sizing
      - Native, 16:9, fill
      - Global setting with optional app (emu, etc.) override
    - Misc.
      - All apps (emus, etc.) now support zoom option in editor
      - All apps (emus, etc.) now support bilinear filter
    - Docker
      - ARM64 image

### 3/19/23 (0.1.0)
    - Quake (New)
      - Supports Quake and Expansion Packs 1-3
    - Neo Geo CD (New)
      - Requires BIOS in feed properties
      - Requires .CHD disc format
    - Bug fixes
      - Metadata now available for NEC PC-FX and Atari 5200

### 2/05/23 (0.0.9)
    - NEC PC-FX (New)
      - Requires BIOS in feed properties (pcfx.rom)
      - Requires .CHD disc format
    - ColecoVision (New)
      - From scratch Emscripten port
      - Requires BIOS to be provided (in feed properties)
      - Virtual on-screen keypad
      - Supports Super Game Module (SGM)
      - Supports Driving, Roller, and Super-action controllers
      - Ability to provide keypad to gamepad mappings (Mappings tab in Coleco
        item editor)
      - Ability to provide descriptions of keypad buttons (Descriptions tab in
        Coleco item editor)
    - Atari 5200 (New)
      - Virtual on-screen keypad
      - Ability to provide keypad to gamepad mappings (Mappings tab in 5200
        item editor)
      - Ability to provide descriptions of keypad buttons (Descriptions tab
        in 5200 item editor)
      - Currently "experimental" due to the following issues (core emulator
        defects):
        - Single player only (core does not support second fire or keypad for
          player 2)
        - Does not support newer homebrew (unsupported cart mappings)
        - Analog quirks (Holding analog stick in a direction prior to level
          starting causes odd behavior: Centipede, Missile Command, probably
          others).
        - Keypad seems to inconsistently accept presses (Only experienced with
          Star Raiders)
    - Sony PlayStation
      - Ability to reset Disc (useful for save state-based disc swaps)

### 12/15/22 (0.0.8)
    - PC Engine CD support
      - Requires BIOS (feed properties)
      - Disc images must be in .CHD format
      - Games must be added manually (same as PlayStation)
    - Save state support
      - Requires cloud storage to be enabled
      - All emulators supported with exception of Atari 2600 and 7800
    - Nintendo 64
      - Fix for Pilotwings 64 graphical glitches
    - Sony Playstation
      - Ability to disable Memory Card 1 (Memory Card 0 still enabled)
    - NEC PC Engine
      - Swapped buttons III and IV when using 6 button mode
      - Added ability to map SELECT and RUN to standard buttons
        (when in 2 button mode)
    - Editor
      - Feed properties page now has a pulldown to select the application
        (emulator) to edit settings for (BIOS, etc.)
    - Player
      - Left and right bumpers can be used to switch between tabs

### 11/17/22 (0.0.7)
    - Sega CD (New)
      - Requires BIOS for each region (USA, EUR, JPN) (feed properties)
      - Disc images must be in .CHD format
      - Games must be added manually (same as PlayStation)
    - Sony PlayStation
      - No longer tagged as experimental
    - Custom CSS capability in feeds.
    - Bug fixes
      - Sony PlayStation
        - Fixed display driver issue that was causing certain games to crash

### 11/07/22 (0.0.6.2)
    - PlayStation
      - Decreased memory usage when loading discs.
        - Allows larger .CHD/.PBP files to be loaded.
        - To increase likelihood of a game loading, use standalone-based
          links on both iOS (add to home) and Xbox Edge browsers (game-specific
          tab).

### 11/06/22 (0.0.6.1)
    - PlayStation
      - Fixed issue causing L1 not to work with keyboard.
    - Editor
      - Fixed defect that would cause editor to crash when experimental
        mode was disabled, and the last type used in an item editor was
        an experimental type (N64 or PSX).

### 10/31/22 (0.0.6)
    - PlayStation (New)
      - PlayStation application (emulator)
      - Only .CHD and .PBP files are supported (BIN/CUE and ISO are not
          supported).
      - Games must be added manually (versus auto-detection).
          See PlayStation Application documentation, for more details.
    - Editor
      - Auto-completion of game titles (and related artwork loading) via the
          "title" text field (Item editor, General page).
      - When creating stand-alone links you can choose to shorten the link
          (via TinyURL). This allows for links to be used within iMessage
          (full versions get truncated).
      - Switched the look of select items (drop-downs) in the editor to
          provide more vertical real estate.
    - GBA: Added ability to "Disable Game Lookup" for settings based on
        Game ID. This allows for all settings to be overridden even if
        the game is recognized. This is typically useful for "hacks" that
        are based on a standard game ID, but have unique settings
        (use of Real-time clock, etc.).
    - Bug fixes
      - Editor: Multi-line fields now work correctly on Safari for Mac

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
    - Nintendo 64 (New)
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
    - FBNeo support, 6907 games total, (Neo Geo, Capcom, Konami, etc.) (New)
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
      - Atari Lynx (New)
    - New implementation of NES display layer
    - Adjusted Atari 7800 screen sizes
    - GBA save game fixes
    - Editor categories tab now supports copy/paste (including between feeds)

### 02/21/22 (0.0.2)
    - Added the following applications (emulators):
      - Bandai WonderSwan (New)
      - Bandai WonderSwan Color (New)
      - NEC PC Engine (TurboGrafx-16) (New)
      - NEC SuperGrafx (New)
      - Neo Geo Pocket (New)
      - Neo Geo Pocket Color (New)
      - Nintendo Virtual Boy (New)

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
