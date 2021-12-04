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
    const { containerRef, heightRef, textRef, FADE_CLASS, FADE_PAUSE, 
      INTERVAL, PAUSE, SCROLL_SPEED } = this;
    const textEl = textRef.current;
    const boxEl = containerRef.current;
    const heightEl = heightRef.current;

    let topPos = 0; 
    let pause = 0; 
    let state = 0;
    let moved = false;

    this.scrollFunction = () => {                        
      const boxHeight = boxEl.offsetHeight;
      const textHeight = textEl.offsetHeight;  
      let adjustMult = (SCROLL_SPEED / heightEl.offsetHeight) | 0;      
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
        if ((textHeight + topPos) > (boxHeight + 1)) {
          if (!moved) {
            pause = PAUSE; moved = true;
          } else {
            textEl.style.top = --topPos + 'px';
            interval = INTERVAL * adjustMult;
          }
        } else if (moved) {
          pause = PAUSE; state++;
        }
      }

      this.intervalId = setTimeout(this.scrollFunction, interval);
    };
    
    this.intervalId = setTimeout(this.scrollFunction, INTERVAL);
  }

  componentWillUnmount() {
    const { intervalId } = this;
    if (intervalId) {
      clearInterval(intervalId)
    }    
  }

  MIN_LENGTH = 155;

  render() {
    const { containerRef, heightRef, textRef, MIN_LENGTH } = this;
    const { text } = this.props;

    const lines = text.split("\n");    
    const textLines = [];

    let inPara = false;
    let paraLines = [];
    let count = 0;
    let len = 0;
    for (let i = 0; i < lines.length; i++) {
      if (len > MIN_LENGTH) {
        break;
      }
      const line = lines[i].trim();
      len += line.length;
      if (line.length === 0) {
        if (!inPara) {
          inPara = true;
          count = 0;
        } else if (paraLines.length > 0) {          
          textLines.push(<p>{paraLines}</p>)
          inPara = false;
          paraLines = [];
          count = 0;
        }
      } else {
        const target = inPara ? paraLines : textLines;
        target.push(<>{count > 0 ? <br/> : null}{line}</>);
        count++;
      }
    }
    if (paraLines.length > 0) {
      textLines.push(<p>{paraLines}</p>);      
    }

    // for (let i = 0; i < lines.length; i++) {
    //   const line = lines[i].trim();
    //   if (line.length > 0) {
    //     textLines.push(<>{line}</>);
    //     break;
    //   }
    // }

    return (
      <div 
        className="scroll-container" 
        ref={containerRef}
        onMouseEnter={() => {
          if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null;
          }    
        }}
        onMouseLeave={() => {
          this.intervalId = setTimeout(this.scrollFunction, this.INTERVAL);
        }}
      >
        <div className="scroll-text" ref={textRef}>
          {textLines}          
        </div>
        <div className="scroll-height" ref={heightRef}>M</div>
      </div>        
    );
  }
};