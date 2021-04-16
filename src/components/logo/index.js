import React, { Component } from "react";
import LogoImage from "../../images/logo/webrcade-logo-dark.svg"

require("./style.scss");

export default class Logo extends Component {
  render() {
    return (
      <div className="logo">
        <div className="logo-left-text">web</div>
        <img className="logo-image" alt="webЯcade" src={LogoImage}></img>
        <div className="logo-right-text">cade</div>
      </div>
    );
  }
};
