import React, { Component } from "react";

import {
  ImageButton,
  SettingsWhiteImage,
} from '@webrcade/app-common'

import TextScroll from "../../../components/textscroll"

require("./style.scss");

export default class AppDetails extends Component {
  timeoutId = null;
  lastKey = null;

  render() {
    const { backgroundSrc, defaultBackgroundSrc, bottom, buttons,
      description, disable, focusGrid, itemKey, onSettings, subTitle,
      title, pixelated, settingsButtonRef } = this.props;
    const key = itemKey;
    const detailsRightRef = this.detailsRightRef;

    if ((key !== this.lastKey) && detailsRightRef) {
      this.lastKey = key;
      const WAIT = 250;
      const start = new Date().getTime();

      if (this.timeoutId) window.clearTimeout(this.timeoutId);

      // Remove display of right details
      detailsRightRef.classList.remove('fade-in');
      detailsRightRef.style.backgroundImage = 'none';

      // Common fade in
      const fadeIn = () => {
        const elapsed = new Date().getTime() - start;
        const wait = (elapsed > WAIT ? 0 : (WAIT - elapsed));
        this.timeoutId = window.setTimeout(() => {
          if (key === this.lastKey) {
            detailsRightRef.classList.add('fade-in');
          }
        }, wait);
      }

      const displayBackground = (src) => {
        if (key === this.lastKey) {
          detailsRightRef.style.backgroundImage = "url(\"" + src + "\")";
          fadeIn();
        }
      }

      // Attempt to load the background image
      const img = new Image();
      img.onload = () => { displayBackground(img.src); };
      img.onerror = () => {
        // If an error occurred, attempt to load default background
        const defaultImg = new Image();
        defaultImg.onload = () => { displayBackground(defaultImg.src); };
        defaultImg.src = defaultBackgroundSrc;
      }
      img.src = backgroundSrc;
    }

    const rightClass =
      "app-details-right" + (pixelated ? " app-details-right--pixelated" : "")

    return (
      <div className="app-details-content">
        <div className="app-details-background">
          <div className="app-details-left"></div>
          {!disable ? (
            <div className="details-header-nav">
              <ImageButton
                className={"details-header-nav-button"}
                onPad={e => focusGrid.moveFocus(e.type, settingsButtonRef)}
                onClick={() => onSettings()}
                ref={settingsButtonRef}
                imgSrc={SettingsWhiteImage}
              />
            </div>
          ) : null }
          <div ref={(detailsRight) => { this.detailsRightRef = detailsRight; }} className={rightClass}>
          </div>
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
