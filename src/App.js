import React, { Component } from "react";
import Slider from "./components/slider/slider.js";

require("./scss/App.scss");

export class App extends Component {
  constructor() {
    super();
    this.state = {
      games: [],
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
        let games = [
          {
            title: "B*nQ",
            thumbnail: "https://www.mobygames.com/images/shots/l/529340-b-nq-atari-7800-screenshot-i-fell-off-the-board-my-such-language.png"
          }
        ];
        
        let gamesOut = [];
        while (gamesOut.length < 20) {
          gamesOut = gamesOut.concat(games);
        }
        let index = 0;
        gamesOut = gamesOut.map(game => { game.id = index++; return game });
    
        this.setState({ games: gamesOut });
        //carousel.select();
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    let games = [
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

    let gamesOut = [];
    while (gamesOut.length < 20) {
      gamesOut = gamesOut.concat(games);
    }
    let index = 0;
    gamesOut = gamesOut.map(game => { game.id = index++; return game });

    this.setState({ games: gamesOut });

    document.addEventListener("keyup", this.keyUpListener);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.keyUpListener);
  }

  render() {
    const { games } = this.state;

    return (
      <div className="App">
        <h1 className="App-title">
          web<span>Я</span>cade
        </h1>
        <Slider games={games} ref={this.sliderRef} />
      </div>
    );
  }
}

export default App;
