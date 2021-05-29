import { FeedInfo } from './feedinfo.js'

class Feeds {
  constructor(propsArray) {
    this.feeds = [];
    if (propsArray) {
      this.feeds = propsArray.map(props => new FeedInfo(props));      
    }
  }  

  getInfoArray() {
    return this.feeds;
  }

  getPropsArray() {
    return this.feeds.map(info => info.getProps());      
  }
}

export { Feeds }