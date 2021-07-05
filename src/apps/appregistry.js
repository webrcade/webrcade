import APP_TYPES from './applist.js';
import { AppProps, UrlUtil } from '@webrcade/app-common';

class AppRegistry {
  static instance = AppRegistry.instance || new AppRegistry();

  constructor() {
    APP_TYPES.forEach((appType) => {
      this.APP_TYPES[appType.key] = appType;
      appType.type = appType.absoluteKey === undefined ?
        appType.key : appType.absoluteKey;      
    });
  }

  APP_TYPES = {}

  validate(app) {
    const APP_TYPES = this.APP_TYPES;
    if (app.title === undefined) {
      throw new Error("Missing 'title' property");
    }
    if (app.type === undefined) {
      throw new Error("Missing 'type' property");
    }
    if (APP_TYPES[app.type] === undefined) {
      throw new Error("'type' is invalid.");
    }    
    APP_TYPES[app.type].validate(app);
  }

  getDefaultBackground(app) {
    const APP_TYPES = this.APP_TYPES;
    return APP_TYPES[app.type].background;
  }

  getDefaultThumbnail(app) {
    const APP_TYPES = this.APP_TYPES;
    return APP_TYPES[app.type].thumbnail;
  }

  getBackground(app) {
    return app.background !== undefined ? 
      app.background : this.getDefaultBackground(app);
  }

  getThumbnail(app) {
    return app.thumbnail !== undefined ? 
      app.thumbnail : this.getDefaultThumbnail(app);
  }

  getDescription(app) {
    const APP_TYPES = this.APP_TYPES;
    return app.description !== undefined ? 
      app.description : APP_TYPES[app.type].description;
  }

  getName(app) {
    const APP_TYPES = this.APP_TYPES;
    return APP_TYPES[app.type].name;
  }

  getLocation(app) {
    const { RP_DEBUG, RP_PROPS } = AppProps;
    const { props } = app;    
    const { APP_TYPES } = this;

    const appType = APP_TYPES[app.type];
    const outProps = { 
      type: appType.type,
      title: this.getLongTitle(app),
      app: this.getName(app)
    };    

    if (props !== undefined) {
      Object.assign(outProps, props);
    }
        
    let loc = UrlUtil.addParam(
      appType.location, RP_PROPS, AppProps.encode(outProps));

    const debug = UrlUtil.getBoolParam(
      window.location.search, RP_DEBUG);
    if (debug) {
      loc = UrlUtil.addParam(loc, RP_DEBUG, 'true');
    }
    return loc;
  }

  getTitle(app) {
    return app.title;
  }

  getLongTitle(app) {
    return app.longTitle !== undefined ? 
      app.longTitle : this.getTitle(app);
  }
};

export { AppRegistry };
