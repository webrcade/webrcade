import React, { Component } from "react";
import { 
  WebrcadeLogoDarkImage,
  WebrcadeLogoLargeImage  
} from '@webrcade/app-common'

require("./style.scss");

export default class Logo extends Component {  
  render() {
    const { size } = this.props;

    const logoName = ( size === 'large' ? 'logoLarge' : 'logo');
    const logo = ( size === 'large' ? WebrcadeLogoLargeImage : WebrcadeLogoDarkImage);

    return (
      <div className={logoName}>
      <div className={logoName + '-left-text'}>web</div>
         <img className={logoName + '-image'} alt="webЯcade" src={logo}></img>
         <div className={logoName + '-right-text'}>cade</div>
       </div>
    );
  }
};
