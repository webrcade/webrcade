import APPLIST from './applist.js';

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
    return app.title !== undefined &&
    APPS[app.app] !== undefined;
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
    return APPS[app.app].location;
  }
};

export { AppRegistry };
