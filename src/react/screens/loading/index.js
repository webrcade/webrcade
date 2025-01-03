import React, { Component } from "react";
import Logo from '../../components/logo';

require("./style.scss");

export default class LoadingScreen extends Component {

  getLoadingText(text) {
    return text ?
      <div className="loading-text">{text}</div> : null;
  }

  render() {
    const { text } = this.props;

    return (
      <div id="loadingScreen" className="loading">
        <div><Logo size="large"/></div>
        {this.getLoadingText(text)}
      </div>
    );
  }
};
