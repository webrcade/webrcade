import APP_TYPES from './applist.js';
import { AppProps, UrlUtil } from '@webrcade/app-common';

class AppRegistry {
  static instance = AppRegistry.instance || new AppRegistry();

  constructor() {
    APP_TYPES.forEach((appType) => {
      this.APP_TYPES[appType.key] = appType;
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

  getBackground(app) {
    const APP_TYPES = this.APP_TYPES;
    return app.background !== undefined ? 
      app.background : APP_TYPES[app.type].background;
  }

  getThumbnail(app) {
    const APP_TYPES = this.APP_TYPES;
    return app.thumbnail !== undefined ? 
      app.thumbnail : APP_TYPES[app.type].thumbnail;
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
    const APP_TYPES = this.APP_TYPES;
    const { props } = app;    
    const location = APP_TYPES[app.type].location;

    return props === undefined ? location : 
      UrlUtil.addParam(location, AppProps.RP_PROPS, AppProps.encode(props));
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
