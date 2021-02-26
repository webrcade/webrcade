import React, { Component } from "react";
import { AppRegistry } from '../../apps'

require("./style.scss");

export default class AppDetails extends Component {
  timeoutId = null;

  render() {
    const { app, buttons, bottom } = this.props;
    const reg = AppRegistry.instance;

    let imageStyle = app ? {
      backgroundImage: 'url(' + reg.getBackground(app) + ')',
    } : {};

    let el = document.querySelector('.app-details-right');
    if (el) {
      el.classList.remove('fade-in');
      if (this.timeoutId) window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(() => {
        el.classList.add('fade-in');
      }, 250);
    }

    return (
      <div className="app-details-content">
        <div className="app-details-background">
          <div className="app-details-left"></div>
          <div className="app-details-right" style={imageStyle}></div>
        </div>
        <div className="app-details-content-container">
          <div className="app-details-content-container-title">{app ? app.title : ''}</div>
          <div className="app-details-content-container-app">{app ? reg.getName(app) : ''}</div>
          <div className="app-details-content-container-description">{app ? reg.getDescription(app) : ''}</div>
          <div className="app-details-content-container-buttons">{buttons}</div>
          <div className="app-details-content-container-bottom-comp">{bottom}</div>
        </div>
      </div>
    );
  }
};
