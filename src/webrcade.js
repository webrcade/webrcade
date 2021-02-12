import React, { Component } from "react";
import Slider from "./components/slider/slider.js";
import AppDetails from "./components/app-details/index.js";

require("./scss/webrcade.scss");

export class Webrcade extends Component {
  constructor() {
    super();
    this.state = {
      apps: [],
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
        thumbnail: "https://www.mobygames.com/images/shots/l/529340-b-nq-atari-7800-screenshot-i-fell-off-the-board-my-such-language.png"
      }, {
        title: "Basketbrawl",
        thumbnail: "https://www.mobygames.com/images/shots/l/56349-basketbrawl-atari-7800-screenshot-title-screen.gif"
      }, {
        title: "Beef Drop",
        thumbnail: "https://www.mobygames.com/images/shots/l/311802-beef-drop-atari-7800-screenshot-level-2.png"
      }, {
        title: "Commando",
        thumbnail: "https://www.mobygames.com/images/shots/l/56374-commando-atari-7800-screenshot-title-screen.gif"
      }, {
        title: "Fatal Run",
        thumbnail: "https://www.mobygames.com/images/shots/l/56386-fatal-run-atari-7800-screenshot-title-screen.gif"
      }
    ];

    let appsOut = [];
    while (appsOut.length < 20) {
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
    const { apps } = this.state;

    return (
      <div className="webrcade">
        <div className="webrcade-outer">
          <AppDetails/>
          <div className="app-category"><a href="javascript:void(0)">Atari 7800 Games</a></div>
          <Slider apps={apps} ref={this.sliderRef} />
        </div>
      </div>
    );
  }
}

export default Webrcade;
