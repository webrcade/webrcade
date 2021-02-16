import React, { Component } from "react";
import Slider from "./components/slider/slider.js";
import AppDetails from "./components/app-details/index.js";
import AppCategory from "./components/app-category/index.js";

require("./scss/webrcade.scss");

export class Webrcade extends Component {
  constructor() {
    super();
    this.state = {
      apps: [],
      currentApp: null
    };

    this.sliderRef = React.createRef();
  }

  keyUpListener = (e) => {
    let slider = this.sliderRef.current;
    switch (e.code) {
      case 'ArrowRight':
        slider.selectNext();
        break;
      case 'ArrowLeft':
        slider.selectPrev();
        break;
      case 'Enter':
        let apps = [
          {
            title: "B*nQ",
            thumbnail: "https://www.mobygames.com/images/shots/l/529340-b-nq-atari-7800-screenshot-i-fell-off-the-board-my-such-language.png"
          }
        ];
        
        let appsOut = [];
        while (appsOut.length < 20) {
          appsOut = appsOut.concat(apps);
        }
        let index = 0;
        appsOut = appsOut.map(app => { app.id = index++; return app });
    
        this.setState({ apps: appsOut });
        //carousel.select();
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    let apps = [
      {
        title: "B*nQ",
        system: "Atari 7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/529340-b-nq-atari-7800-screenshot-i-fell-off-the-board-my-such-language.png",
        background: "https://www.mobygames.com/images/shots/l/529341-b-nq-atari-7800-screenshot-i-completed-the-level.png",
        description: "b*nQ is an attempt to bring Q*bert to the Atari 7800. In the game, you must hop from one block to the next, changing its color, without getting stomped by the enemies or hopping off the pyramid. After you have changed all the block's colors, it is off to the next level."
      }, {
        title: "Basketbrawl",
        system: "Atari 7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/56349-basketbrawl-atari-7800-screenshot-title-screen.gif",
        background: "https://www.mobygames.com/images/shots/l/56353-basketbrawl-atari-7800-screenshot-a-game-in-progress.gif",
        description: 'Basketbrawl is a video game released for the Atari 7800 in 1990, then later for the Atari Lynx in 1992. It is a sports simulation which allows hitting and fighting with other players. The name is a portmanteau of the words basketball and brawl. Basketbrawl is similar to the 1989 Midway arcade game Arch Rivals which had the tagline "A basket brawl!"'
      }, {
        title: "Beef Drop",
        system: "Atari 7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/311802-beef-drop-atari-7800-screenshot-level-2.png",
        background: "https://www.mobygames.com/images/shots/l/311800-beef-drop-atari-7800-screenshot-he-got-me.png",
        description: "Beef Drop is a port of the popular arcade game Burgertime, which Ken Siders first ported to the Atari 5200 and 8-bit computers. 7800 owners are in for a special treat, as the 7800 version is even truer to the original arcade experience, and features better graphics than the 5200/8-bit version, making the 7800 version the definitive release of Beef Drop."
      }, {
        title: "Commando",
        system: "Atari 7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/56374-commando-atari-7800-screenshot-title-screen.gif",
        background: "https://www.mobygames.com/images/shots/l/56375-commando-atari-7800-screenshot-the-starting-location.gif",
        description: "You are a lone commando fighting against an overwhelming rebel force. You must make your way through several levels to reach the enemy headquarters and destroy it. Along the way you can gain bonus points by killing enemy officers and rescuing prisoners. One of four difficulty levels may be selected."
      }, {
        title: "Fatal Run",
        system: "Atari 7800",
        thumbnail: "https://www.mobygames.com/images/shots/l/56386-fatal-run-atari-7800-screenshot-title-screen.gif",
        background: "https://www.mobygames.com/images/shots/l/56387-fatal-run-atari-7800-screenshot-racing-to-the-next-city.gif",
        description: "In this post-apocalyptic driving/racing game you must travel to various towns delivering medicine, while on your way to a missile base which houses a rocket that can save the world. While driving through the 32 levels, you'll meet countless enemies who want to stop you from achieving your goal."
      }
    ];

    let appsOut = [];
    while (appsOut.length < 26) {
      appsOut = appsOut.concat(apps);
    }
    let index = 0;
    appsOut = appsOut.map(app => { app.id = index++; return app });

    this.setState({ apps: appsOut });

    document.addEventListener("keyup", this.keyUpListener);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.keyUpListener);
  }

  render() {
    const { apps, currentApp } = this.state;

    return (
      <div className="webrcade">
        <div className="webrcade-outer">
          <AppDetails 
            app={currentApp} 
            bottom={<AppCategory label="Atari 7800 Games"/>}/>
          <Slider 
            apps={apps} 
            ref={this.sliderRef} 
            onSelected={(app) => this.setState({currentApp: app})}/>
        </div>
      </div>
    );
  }
}

export default Webrcade;
