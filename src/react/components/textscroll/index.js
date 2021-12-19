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

  MAX_LENGTH = 600;
  MIN_LINE = 64;

  render() {
    const { containerRef, heightRef, textRef } = this;
    const { text } = this.props;

    const lines = text.split("\n");    
    const textLines = [];

    let inPara = false;
    let paraLines = [];
    let count = 0;
    let len = 0;
    let exit = false;

    for (let i = 0; i < lines.length && !exit; i++) {
      if (len >= this.MAX_LENGTH) {
        // console.log('length exceeds max, breaking');
        break;
      }
      let line = lines[i].trim();      
      let lineLen = line.length;
      let newLen = len + lineLen;
      if (newLen > this.MAX_LENGTH) {
        // console.log('pre: ' + line + ", len = " + line.length);
        let lastChar = line.length - (newLen - this.MAX_LENGTH);
        if (lastChar < this.MIN_LINE) {
          lastChar = this.MIN_LINE;
        }
        line = line.substring(0, lastChar);
        let lastSpace = line.lastIndexOf('.');
        const lastExc = line.lastIndexOf('!');
        if (lastExc > lastSpace) {
          lastSpace = lastExc;
        }
        const lastSemi = line.lastIndexOf(';');
        if (lastSemi > lastSpace) {
          lastSpace = lastSemi;
        }
        if (lastSpace < 0) {
          lastSpace = line.lastIndexOf(' ');
        }
        if (lastSpace > 0) {          
          const endChar = line.charAt(lastSpace - 1);
          if (endChar === ',' || endChar === ':' || endChar === ';' ||
            endChar === '[' || endChar === '(' || endChar === '&' ||
            endChar === '!' || endChar === '?') {
            lastSpace--;
          }
          line = line.substring(0, lastSpace).trim();                   
        }
        if (line.length > 0) {          
          line += "...";
        }
        lineLen = line.length;
        // console.log('marking to exit');
        exit = true;      
      }      
      // console.log(line);
      // console.log('line: ' + lineLen);
      if (lineLen === 0) {
        // console.log('empty line: ' + this.MIN_LINE);
        len += this.MIN_LINE;         
        if (!inPara) {
          inPara = true;
          count = 0;          
        } else if (paraLines.length > 0) {          
          textLines.push(<div className="scroll-block">{paraLines}</div>)
          paraLines = [];
          count = 0;
        }
      } else {
        len += (lineLen < this.MIN_LINE ? this.MIN_LINE : lineLen);
        const target = inPara ? paraLines : textLines;
        target.push(<>{count > 0 ? <br/> : null}{line}</>);
        count++;
      }
      // console.log('currentTotal: ' + len);
    }
    if (paraLines.length > 0) {
      textLines.push(<div className="scroll-block">{paraLines}</div>);      
    }
    // console.log('total: ' + len);

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