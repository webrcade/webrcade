import React, { Component } from "react";
import Slider from "./components/slider";
import AppDetails from "./components/app-details";
import AppCategory from "./components/app-category";
import ImageButton from "./components/image-button";
import { GamepadNotifier, FocusGrid } from "./input"
import { AppRegistry } from './apps'
import { isDev } from '@webrcade/app-common'

import PlayImageWhite from "./images/play-white.svg"
import PlayImageBlack from "./images/play-black.svg"

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    this.state = {
      apps: [],
      currentApp: null,
      mode: this.ModeEnum.MENU,
      initial: true
    };

    this.sliderRef = React.createRef();
    this.playButtonRef = React.createRef();
    this.categoryRef = React.createRef();

    this.focusGrid.setComponents([
      [this.playButtonRef],
      [this.categoryRef],
      [this.sliderRef]
    ]);
  }

  ModeEnum = {
    MENU: "menu",
    APP: "app"
  }

  HASH_PLAY = "play";

  focusGrid = new FocusGrid();

  gamepadCallback = (e) => {
    const { focusGrid } = this;
    focusGrid.focus();
    return true;
  }

  hashChange = () => {
    const { HASH_PLAY, ModeEnum } = this;
    if (!window.location.hash.includes(HASH_PLAY)) {
      this.setState({ mode: ModeEnum.MENU });
    }
  }

  componentDidMount() {
    const { ModeEnum } = this;
    const { mode } = this.state;

    window.addEventListener('hashchange', this.hashChange, false);

    // Clear hash if displaying menu
    const hash = window.location.href.indexOf('#');
    if (mode === ModeEnum.MENU && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }

    // Start the gamepad notifier 
    GamepadNotifier.instance.start();
    GamepadNotifier.instance.setDefaultCallback(this.gamepadCallback);

    let apps = [
      {
        title: "B*nQ",
        app: "7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/529340-b-nq-atari-7800-screenshot-i-fell-off-the-board-my-such-language.png",
        background: "https://www.mobygames.com/images/shots/l/529341-b-nq-atari-7800-screenshot-i-completed-the-level.png",
        description: "b*nQ is an attempt to bring Q*bert to the Atari 7800. In the game, you must hop from one block to the next, changing its color, without getting stomped by the enemies or hopping off the pyramid. After you have changed all the block's colors, it is off to the next level."
      }, {
        title: "Basketbrawl",
        app: "7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/56349-basketbrawl-atari-7800-screenshot-title-screen.gif",
        background: "https://www.mobygames.com/images/shots/l/56353-basketbrawl-atari-7800-screenshot-a-game-in-progress.gif",
        description: 'Basketbrawl is a video game released for the Atari 7800 in 1990, then later for the Atari Lynx in 1992. It is a sports simulation which allows hitting and fighting with other players. The name is a portmanteau of the words basketball and brawl. Basketbrawl is similar to the 1989 Midway arcade game Arch Rivals which had the tagline "A basket brawl!"'
      }, {
        title: "Beef Drop",
        app: "7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/311802-beef-drop-atari-7800-screenshot-level-2.png",
        background: "https://www.mobygames.com/images/shots/l/311800-beef-drop-atari-7800-screenshot-he-got-me.png",
        description: "Beef Drop is a port of the popular arcade game Burgertime, which Ken Siders first ported to the Atari 5200 and 8-bit computers. 7800 owners are in for a special treat, as the 7800 version is even truer to the original arcade experience, and features better graphics than the 5200/8-bit version, making the 7800 version the definitive release of Beef Drop."
      }, {
        title: "Commando",
        app: "7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/56374-commando-atari-7800-screenshot-title-screen.gif",
        background: "https://www.mobygames.com/images/shots/l/56375-commando-atari-7800-screenshot-the-starting-location.gif",
        description: "You are a lone commando fighting against an overwhelming rebel force. You must make your way through several levels to reach the enemy headquarters and destroy it. Along the way you can gain bonus points by killing enemy officers and rescuing prisoners. One of four difficulty levels may be selected."
      }, {
        title: "Fatal Run",
        app: "7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/56386-fatal-run-atari-7800-screenshot-title-screen.gif",
        background: "https://www.mobygames.com/images/shots/l/56387-fatal-run-atari-7800-screenshot-racing-to-the-next-city.gif",
        description: "In this post-apocalyptic driving/racing game you must travel to various towns delivering medicine, while on your way to a missile base which houses a rocket that can save the world. While driving through the 32 levels, you'll meet countless enemies who want to stop you from achieving your goal."
      }, {
        title: "Atari 2600",
        app: "2600"
      }, {
        title: "Atari 7800",
        app: "7800"
      }, {
        title: "Nintendo NES",
        longTitle: "Nintendo Entertainment System",
        app: "nes"
      }, {
        title: "Sega Genesis",
        app: "genesis"
      }
    ];

    let appsOut = [];
    while (appsOut.length < 26) {
      appsOut = appsOut.concat(apps);
    }
    let index = 0;
    appsOut = appsOut.map(app => { app.id = index++; return app });
    //appsOut = [];
    this.setState({ apps: appsOut });
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChange);

    // Stop the gamepad notifier
    GamepadNotifier.instance.stop();
    GamepadNotifier.instance.setDefaultCallback(null);
  }

  componentDidUpdate(prevProps, prevState) {
    const { mode, initial } = this.state;
    const { ModeEnum, sliderRef } = this;

    if (initial ||
      (prevState.mode === ModeEnum.APP && mode === ModeEnum.MENU)) {
      this.setState({ initial: false });
      setTimeout(() => {
        window.focus();
        sliderRef.current.focus();
      }, 0);
    }
  }

  renderMenu() {
    const { apps, currentApp, mode } = this.state;
    const { focusGrid, playButtonRef, sliderRef, categoryRef, ModeEnum, HASH_PLAY } = this;

    return (
      <div className="webrcade">
        <div className={'webrcade-outer' +
          (mode !== ModeEnum.MENU ? ' webrcade-outer--hide' : '')}>
          <AppDetails
            app={currentApp}
            buttons={currentApp ?
              <ImageButton
                onPad={(e) => focusGrid.moveFocus(e.type, playButtonRef)}
                onClick={() => {
                  window.location.hash = HASH_PLAY;
                  this.setState({ mode: this.ModeEnum.APP })
                }}
                ref={playButtonRef}
                imgSrc={PlayImageBlack}
                hoverImgSrc={PlayImageWhite}
                label="PLAY" /> : null}
            bottom={
              <AppCategory
                onPad={(e) => focusGrid.moveFocus(e.type, categoryRef)}
                ref={categoryRef}
                label="Sega Genesis Games" />} />
          <Slider
            onPad={(e) => focusGrid.moveFocus(e.type, sliderRef)}
            apps={apps}
            ref={sliderRef}
            onSelected={(app) => this.setState({ currentApp: app })}
            onClick={(app) => playButtonRef.current.focus()} />
        </div>
      </div>
    );
  }

  renderApp() {
    const { currentApp } = this.state;
    const reg = AppRegistry.instance;

    return (
      <div className="webrcade-app">
        <iframe
          style={!isDev() ? {display: "none"} : {}}        
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; gamepad"
          title={reg.getTitle(currentApp)}
          src={reg.getLocation(currentApp)} />
      </div>
    )
  }

  render() {
    const { mode } = this.state;
    const { ModeEnum } = this;

    return (
      <>
        { this.renderMenu()}
        { mode === ModeEnum.APP ? this.renderApp() : null}
      </>
    );
  }
}

export default Webrcade;
