import React, { Component } from "react";

require("./style.scss");

export default class TextScroll extends Component {  
  constructor() {
    super();
    this.containerRef = React.createRef();
    this.textRef = React.createRef();
    this.heightRef = React.createRef();
    this.intervalId = null;
  }

  FADE_CLASS = "scroll-text--fade-out";
  INTERVAL = 50;
  FADE_PAUSE = 20;
  SCROLL_SPEED = 30;
  PAUSE = 100;

  componentDidMount() {
    const { textRef, containerRef, heightRef, FADE_CLASS, INTERVAL, 
      SCROLL_SPEED, PAUSE, FADE_PAUSE } = this;
    const textEl = textRef.current;
    const boxEl = containerRef.current;
    const heightEl = heightRef.current;

    let topPos = 0; 
    let pause = 0; 
    let state = 0;
    let moved = false;

    const f = () => {                        
      const boxHeight = boxEl.offsetHeight;
      const textHeight = textEl.offsetHeight;  
      let adjustMult = (SCROLL_SPEED/heightEl.offsetHeight) | 0;      
      if (adjustMult <= 0) adjustMult = 1;
      let interval = INTERVAL;

      if (pause > 0) {
        --pause;
        if (pause === 0) {
          if (state === 1) {
            pause = FADE_PAUSE; state++;
            textEl.classList.add(FADE_CLASS);            
          } else if (state === 2) {
            textEl.style.top = 0; topPos = 0;   
            textEl.classList.remove(FADE_CLASS);
            pause = FADE_PAUSE; state++;
          } else if (state === 3) {
            state = 0; moved = false;
          }
        }
      } else {
        if ((textHeight + topPos) > boxHeight) {
          if (!moved) {
            pause = PAUSE; moved = true;
          } else {
            textEl.style.top = --topPos + 'px';
            interval =  INTERVAL*adjustMult;
          }
        } else if (moved) {
          pause = PAUSE; state++;
        }
      }

      this.intervalId = setTimeout(f, interval);
    };
    
    this.intervalId = setTimeout(f, INTERVAL);
  }

  componentWillUnmount() {
    const { intervalId } = this;
    if (intervalId) {
      clearInterval(intervalId)
    }    
  }

  render() {
    const { textRef, containerRef, heightRef } = this;
    const { text } = this.props;

    return (
      <div className="scroll-container" ref={containerRef}>
        <div className="scroll-text" ref={textRef}>{text}</div>
        <div className="scroll-height" ref={heightRef}>M</div>
      </div>        
    );
  }
};