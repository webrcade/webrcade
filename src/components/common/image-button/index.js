import React, { Component } from "react";
import { GamepadNotifier, GamepadEnum } from "../../../input"

require("./style.scss");

export default class ImageButton extends Component {
  constructor() {
    super();

    this.state = {
      focused: false
    };
  }

  gamepadCallback = (e) => {
    const { onPad } = this.props;
    const { focused } = this.state;

    if (!focused) return;

    switch (e.type) {
      case GamepadEnum.A:
        this.onClick();
        break;
      case GamepadEnum.DOWN:
      case GamepadEnum.UP:
      case GamepadEnum.LEFT:
      case GamepadEnum.RIGHT:
        if (onPad) onPad(e);
        break;        
      default: 
        break;
    }
    return true;
  }

  componentDidMount() {
    GamepadNotifier.instance.addCallback(this.gamepadCallback);
  }

  componentWillUnmount() {
    GamepadNotifier.instance.removeCallback(this.gamepadCallback);
  }

  onClick = e => {
    const { onClick } = this.props;
    if (onClick) onClick();
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onBlur = () => {
    this.setState({ focused: false });
  }

  focus() {
    const { focused } = this.state;
    const { button } = this;
    if (!focused && button) {
      button.focus();
      return true;
    }
    return false;
  }

  render() {
    const { label, imgSrc, hoverImgSrc } = this.props;
    const { focused } = this.state;
    return (
      <button
        className="image-button"
        ref={(button) => { this.button = button; }}
        onClick={this.onClick}
        onFocus={this.onFocus}
        onBlur={this.onBlur}> {imgSrc ?
          <img alt={label} src={focused && hoverImgSrc ? hoverImgSrc : imgSrc}></img> : null}
          <div>{label}</div>
      </button>
    );
  }
};
