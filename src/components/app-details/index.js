import React, { Component } from "react";
import ImageButton from "../image-button/index.js";
import PlayImage from "../../images/play.svg"

require("./style.scss");

export class AppDetails extends Component {
  timeoutId = null;

  render() {
    let { app } = this.props;

    let imageStyle = app ? {
      backgroundImage: 'url(' + app.background + ')',
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
          <div className="app-details-content-container-system">{app ? app.system : ''}</div>
          <div className="app-details-content-container-description">{app ? app.description : ''}</div>
          <div className="app-details-content-container-buttons">
            <ImageButton imgSrc={PlayImage} label="PLAY"></ImageButton>
          </div>
          <div className="app-details-content-container-bottom-comp">{this.props.bottom}</div>
        </div>
      </div>
    );
  }
};

export default AppDetails;
