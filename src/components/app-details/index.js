import React from "react";

require("./style.scss");

const AppDetails = ({}) => {
  return (
    <div className="app-details-content">
        <div className="app-details-background">
            <div className="app-details-left"></div>
            <div className="app-details-right"></div>
        </div>
        <div className="app-details-content-container">
            <div className="app-details-content-container-title">Basketbrawl</div>
            <div className="app-details-content-container-system">Atari 7800</div>
            <div className="app-details-content-container-description">
                Basketbrawl is a video game released for the Atari 7800 in 1990, then later for the Atari Lynx in 1992.
                It is
                a sports simulation which allows hitting and fighting with other players. The name is a portmanteau of the
                words
                basketball and brawl. Basketbrawl is similar to the 1989 Midway arcade game Arch Rivals which had the
                tagline "A
                basket brawl!"
            </div>
        </div>
    </div>
  );
};

export default AppDetails;
