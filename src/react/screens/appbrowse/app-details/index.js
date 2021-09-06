import React, { Component } from "react";
import TextScroll from "../../../components/textscroll"

require("./style.scss");

export default class AppDetails extends Component {
  timeoutId = null;
  lastItemKey = null;

  render() {
    const { backgroundSrc, bottom, buttons, description, itemKey, subTitle, title } = this.props;

    // const img = new Image();
    // img.onload = () => { console.log('loaded!') }
    // img.src = backgroundSrc;

    let imageStyle = backgroundSrc ? {
      backgroundImage: 'url(' + backgroundSrc + ')',
    } : {};

    if (itemKey !== this.lastItemKey) {
      this.lastItemKey = itemKey;
      let el = document.querySelector('.app-details-right');
      if (el) {
        el.classList.remove('fade-in');      
      }
      if (this.timeoutId) window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(() => {
        // TODO: Image load, set image, and then fade in...
        el = document.querySelector('.app-details-right');
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
          <div className="app-details-content-container-title">{title ? title : ''}</div>
          {subTitle ? (
            <div className="app-details-content-container-subtitle">{subTitle}</div>
          ) : null}
          {description ? (
            <div className="app-details-content-container-description">              
              <TextScroll key={itemKey} text={description}/>
            </div> 
          ) : null}
          <div className="app-details-content-container-buttons">{buttons}</div>
          <div className="app-details-content-container-bottom-comp">{bottom}</div>
        </div>
      </div>
    );
  }
};
