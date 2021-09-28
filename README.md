# webЯcade: Feed-driven gaming

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

WebЯcade consists of an intuitive [web-based front end](https://docs.webrcade.com/userguide/) that enables playing popular gaming content entirely within the context of the browser across a [wide variety of platforms](https://docs.webrcade.com/platforms/) (Xbox Series X|S, iOS, Android, Windows, macOS). Gamepads are supported (Bluetooth and USB) for both front-end navigation and while playing games.

The content for playing games (binaries, etc.) and populating the front-end (images, etc.) is collected from [cloud-based resources](https://docs.webrcade.com/feeds/resources/) based on [user-defined feeds](https://docs.webrcade.com/feeds/). Each feed item (game, etc.) has an associated application type. [Application types](https://docs.webrcade.com/apps/) include [emulators](https://docs.webrcade.com/apps/emulators/) (Atari, Sega, Nintendo) and [game engines](https://docs.webrcade.com/apps/engines/) (Classic Doom). 


<p align="center">
 <a href="https://play.webrcade.com">
  <img src="https://docs.webrcade.com/assets/images/platforms/ios/safari-full.png?raw=true" width="97%">
 </a>
 <br>
 <i>webЯcade on Safari for iOS (iPhone)</i>
</p>

## Play Now.

Play webЯcade now at [play.webrcade.com](https://play.webrcade.com).

## Documentation

The [webЯcade Documentation](https://docs.webrcade.com/) consists of a [User Guide](https://docs.webrcade.com/userguide/), instructions specific to each [Platform](https://docs.webrcade.com/platforms/) (OS, devices) supported by webЯcade, detailed information (button mappings, etc.) for the various [Application Types](https://docs.webrcade.com/apps/) (emulators, etc.), and guidance for developing your own [Feeds](https://docs.webrcade.com/feeds/).

The following steps are recommended for getting started with webЯcade:

* Review the [User Guide](https://docs.webrcade.com/userguide/) in order to familiarize yourself with the webЯcade front-end.
* Read the documentation for the [Platform](https://docs.webrcade.com/platforms/) (OS, device) you will be using with webЯcade to learn platform-specific details such as how to optimize the experience and how to connect gamepads.
* Review the documentation for each [Application](https://docs.webrcade.com/apps/) that is launched to determine its keyboard and gamepad mappings as well as any other application-specific notes (an application is the emulator or engine being used to play a particular game, etc.).

## Default Feed

The default feed consists of high-quality publicly available games and demos across the various [application types](https://docs.webrcade.com/apps/) ([emulators](https://docs.webrcade.com/apps/emulators/), [engines](https://docs.webrcade.com/apps/engines/), etc.) that are supported by webЯcade.

The [default feed AUTHORS page](./AUTHORS-default-feed.md) includes the list of titles that are included in the default feed, their respective authors, and related links. 

## What is (and is not) webЯcade?

The following lists further describe webЯcade in terms of its focus.

**Primary focus:**

* Runs entirely within the web browser leveraging JavaScript, WebAssembly, and the HTML5 gamepad and audio interfaces
* Adaptive user interface that supports a [wide variety of platforms](https://docs.webrcade.com/platforms/) (Xbox Series X|S, iOS, Android, Windows, macOS)
* Native gamepad support (Bluetooth and USB) for both front-end navigation and while playing games
* [User-defined cloud-based feeds](https://docs.webrcade.com/feeds/) identify the resources (images, etc.) required to populate the front-end as well as the content (binaries, etc.) required to play games
* Each feed item (game, etc.) has an associated application type. [Application types](https://docs.webrcade.com/apps/) include [emulators](https://docs.webrcade.com/apps/emulators/) (Atari, Sega, Nintendo) and [game engines](https://docs.webrcade.com/apps/engines/) (Classic Doom). The quantity and types of applications will continue to expand over time.

**Not focused on:**

* Directly playing locally stored game content (ROMs, etc.)<br>*(Technically possible by using a local web server, but not a primary use case)*
* The "latest and greatest" emulator features and compatibility<br>*(Primary emphasis is on compatibility with popular game content across a variety of platforms while minimizing resource requirements)*
* Touch-based (virtual) gamepad controls<br>*(The focus is on native gamepad support via Bluetooth and USB)*

## LICENSE

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
