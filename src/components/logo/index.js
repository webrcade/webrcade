import React, { Component } from "react";
import LogoImage from "../../images/logo/webrcade-logo-dark.svg"
import LogoImageLarge from "../../images/logo/webrcade-logo-large.svg"

require("./style.scss");

export default class Logo extends Component {  
  render() {
    const { size } = this.props;

    const logoName = ( size === 'large' ? 'logoLarge' : 'logo');
    const logo = ( size === 'large' ? LogoImageLarge : LogoImage);

    return (
      <div className={logoName}>
      <div className={logoName + '-left-text'}>web</div>
         <img className={logoName + '-image'} alt="webЯcade" src={logo}></img>
         <div className={logoName + '-right-text'}>cade</div>
       </div>
    );
  }
};
