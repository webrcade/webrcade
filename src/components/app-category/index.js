import React, { Component } from "react";
import { Icon } from "@iconify/react";
import chevronRight from "@iconify/icons-mdi/chevron-right";
import { GamepadNotifier } from "../../utils"

require("./style.scss");

export default class AppCategory extends Component {
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
      case "a":
        this.onClick();
        break;
      case "down":
      case "up":
        if (onPad) onPad(e);
        break;        
      default: 
        break;
    }
    return true;
  }

  onClick = (e) => {
    const { onClick } = this.props;
    if (onClick) onClick();    
  }

  componentDidMount() {
    GamepadNotifier.instance.addCallback(this.gamepadCallback);
  }

  componentWillUnmount() {
    GamepadNotifier.instance.removeListener(this.gamepadCallback);
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
    const { label } = this.props;
    return (
      <button 
        ref={(button) => { this.button = button; }} 
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClick={this.onClick} className="app-category">
        <div className="app-category-label"><span>{label}</span></div>
        <div className="app-category-flyout"><span>Show Categories</span></div>
        <div className="app-category-caret"><Icon icon={chevronRight} /></div>
      </button>
    );
  }
};

