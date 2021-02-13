import React, { Component } from "react";

require("./style.scss");



export class AppDetails extends Component {
    constructor(props) {
        super(props);
    }

    timeoutId = null;

    render() {
        let { app } = this.props;

        let imageStyle = app ? {
            backgroundImage: 'url(' + app.thumbnail + ')',
        } : {};

        let el = document.querySelector('.app-details-background');
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
                    <div className="app-details-content-container-description">
                        Basketbrawl is a video game released for the Atari 7800 in 1990, then later for the Atari Lynx in 1992. It is a sports simulation which allows hitting and fighting with other players. The name is a portmanteau of the words basketball and brawl. Basketbrawl is similar to the 1989 Midway arcade game Arch Rivals which had the tagline "A basket brawl!"
                    </div>
                </div>
            </div>
        );
    }
};

export default AppDetails;
