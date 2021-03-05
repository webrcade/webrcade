import APPLIST from './applist.js';
import { AppProps, UrlUtil } from '@webrcade/app-common';

class AppRegistry {
  static instance = AppRegistry.instance || new AppRegistry();

  constructor() {
    APPLIST.forEach((app) => {
      this.APPS[app.key] = app;
    });
  }

  APPS = {}

  isValidApp(app) {
    const APPS = this.APPS;
    return app.title !== undefined && APPS[app.app] !== undefined ? 
      APPS[app.app].isValid(app) : false;
  }

  getBackground(app) {
    const APPS = this.APPS;
    return app.background !== undefined ? 
      app.background : APPS[app.app].background;
  }

  getThumbnail(app) {
    const APPS = this.APPS;
    return app.thumbnail !== undefined ? 
      app.thumbnail : APPS[app.app].thumbnail;
  }

  getDescription(app) {
    const APPS = this.APPS;
    return app.description !== undefined ? 
      app.description : APPS[app.app].description;
  }

  getName(app) {
    const APPS = this.APPS;
    return APPS[app.app].name;
  }

  getLocation(app) {
    const APPS = this.APPS;
    const { props } = app;    
    const location = APPS[app.app].location;

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
