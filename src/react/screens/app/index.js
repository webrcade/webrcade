import React, { Component } from "react";
import { AppRegistry } from '../../../apps';
import { isDev } from '@webrcade/app-common'

require("./style.scss");

export default class AppScreen extends Component {
  render() {
    const { app, frameRef } = this.props;
    const reg = AppRegistry.instance;
    
    return (      
      <div className="webrcade-app">        
        {
          // eslint-disable-next-line
        }<iframe
          ref={frameRef}
          style={!isDev() ? { display: "none" } : {}}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; gamepad"
          src={reg.getLocation(app)} />
      </div>
    )
  }
};
