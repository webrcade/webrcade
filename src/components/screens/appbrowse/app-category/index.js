import React, { Component } from "react";
import { Icon } from "@iconify/react";
import chevronRight from "@iconify/icons-mdi/chevron-right";
import { GamepadNotifier, GamepadEnum } from "../../../../input"

require("./style.scss");

export default class AppCategory extends Component {
  constructor() {
    super();

    this.state = {
      focused: false,
    };
  }

  gamepadCallback = e => {
    const { onPad } = this.props;
    const { focused } = this.state;

    if (!focused) return false;

    switch (e.type) {
      case GamepadEnum.A:
        this.onClick();
        break;
      case GamepadEnum.DOWN:
      case GamepadEnum.UP:
        if (onPad) onPad(e);
        break;
      default:
        break;
    }
    return true;
  }

  onClick = e => {
    const { onClick } = this.props;
    if (onClick) onClick();
  }

  componentDidMount() {
    GamepadNotifier.instance.addCallback(this.gamepadCallback);
  }

  componentWillUnmount() {
    GamepadNotifier.instance.removeCallback(this.gamepadCallback);
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

    if (!focused && button && this.isFocusable()) {
      button.focus();
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { isSelectable } = this.props;

    if (prevProps.isSelectable && !isSelectable) {
      this.setState({ focused: false });
    }
  }

  isFocusable() {
    const { isSelectable } = this.props;
    return isSelectable;
  }

  render() {
    const { label, isSelectable } = this.props;    
    const mainClassName = 
      `${isSelectable ? "app-category" : "app-categories"} app-category-fade`;

    return (
      <>
        {isSelectable ? (
          <button
            ref={(button) => { this.button = button; }}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onClick={this.onClick} className={mainClassName}>
            <div className="app-category-label"><span>{label}</span></div>
            <div className="app-category-flyout"><span>Show Categories</span></div>
            <div className="app-category-caret"><Icon icon={chevronRight} /></div>
          </button>) : (
          <div className={mainClassName}>
            <div className="app-category-label">{label}</div>
          </div>)
        }
      </>
    );
  }
};

