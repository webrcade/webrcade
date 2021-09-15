# webЯcade

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Overview

WebЯcade consists of a simple [web-based front end](https://docs.webrcade.com/userguide/) that provides the ability to play popular gaming content entirely within the context of the browser across a [wide variety of platforms](https://docs.webrcade.com/platforms/). Gamepads are supported (Bluetooth and USB) for front-end navigation and when playing games.

The content for playing games (binaries, etc.) and populating the front-end (images, etc.) is collected from [cloud-based resources](https://docs.webrcade.com/feeds/resources/) based on [user-defined feeds](https://docs.webrcade.com/feeds/) that are registered via the webЯcade front-end.

| [![](https://docs.webrcade.com/assets/images/platforms/ios/safari-full.png?raw=true)](https://play.webrcade.com) | 
|:--:| 
| *webЯcade on iOS (iPhone)* |

## Play Now.

Play webЯcade now at [play.webrcade.com](https://play.webrcade.com).

## Documentation

TODO

The recommended steps for getting started with webЯcade are listed below:

* Review the [User Guide](https://docs.webrcade.com/userguide/) in order to familiarize yourself with the webЯcade front-end.
* Read the documentation for the [Platform](https://docs.webrcade.com/platforms/) you will be using with webЯcade to learn platform-specific details such as how to optimize the experience and how to connect controllers.
* Review the documentation for each [Application](https://docs.webrcade.com/apps/) that is launched to determine its keyboard and gamepad mappings as well as any other application-specific notes (an application is the emulator or engine being used to play a particular game, etc.).

## Default Feed

TODO

## Detailed Description

The following lists attempt to further describe webЯcade in terms of its primary features versus those features that are not a direct focus.

**Primary features:**

* Runs entirely within the web browser leveraging JavaScript, WebAssembly, and the HTML5 gamepad and audio interfaces
* Adaptive user interface supports [wide variety of platforms](https://docs.webrcade.com/platforms/) (Xbox Series X|S, iOS, Android, Windows, macOS)
* Native gamepad support (Bluetooth and USB) for both front-end navigation and when playing games
* [User-defined cloud-based feeds](https://docs.webrcade.com/feeds/) identify the resources (images, etc.) required to populate the front-end as well as the content (binaries, etc.) required to play games

**Not focused on:**

* Directly playing locally stored game content (ROMs, etc.)
*(Technically possible by using a local web server, but not a primary use case)*
* The "latest and greatest" emulator features and compatibility
*(Primary emphasis is on compatibility with popular game content across a variety of platforms while minimizing resource requirements)*
* Touch-based (virtual) gamepad controls
*(The focus is native gamepad controller support via Bluetooth and USB)*

## LICENSE

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.