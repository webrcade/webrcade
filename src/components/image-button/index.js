import React, { Component } from "react";

require("./style.scss");

export class ImageButton extends Component {
  constructor() {
    super();
    
    this.state = {
      focused: false
    };
  }
  onClick = (e) => {
    // this.button.blur();
  }

  onFocus = () => {
    this.setState({focused: true});
  }

  onBlur = () => {
    this.setState({focused :false});
  }

  render() {
    let { label, imgSrc, hoverImgSrc } = this.props;
    let { focused } = this.state;
    return (
      <button
        className="image-button"
        ref={(button) => { this.button = button; }}
        onClick={this.onClick}
        onFocus={this.onFocus} 
        onBlur={this.onBlur}>
        <img alt={label} src={focused && hoverImgSrc ? hoverImgSrc : imgSrc}></img>
        <div>{label}</div>
      </button>
    );
  }
};

export default ImageButton;
