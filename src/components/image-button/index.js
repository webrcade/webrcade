import React, { Component } from "react";

require("./style.scss");

export class ImageButton extends Component {
  onClick = (e) => {
    // this.button.blur();
  }

  render() {
    let { label, imgSrc } = this.props;
    return (
      <button
        className="image-button"
        ref={(button) => { this.button = button; }}
        onClick={this.onClick}>
        <img alt={label} src={imgSrc}></img>
        <div>{label}</div>
      </button>
    );
  }
};

export default ImageButton;
