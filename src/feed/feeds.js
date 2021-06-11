import { FeedBase } from './feedbase.js'

class Feeds extends FeedBase {
  constructor(feeds, minLength) {
    super(minLength);
    this.nextFeedId = 0;
    this.parsedFeeds = [];
    this.feeds = [];
    feeds.forEach(f => this._addFeed(f));
    this._expand();    
  }  

  static DEFAULT_ID = -1;
  static ADD_ID = -2;
  static NONE_URL = "none";

  validate(f) {
    if (f.title === undefined) {
      this._logInvalidObject('Feed missing title', f);
      return false;
    } else if (f.url === undefined) {
      this._logInvalidObject('Feed missing url', f);
      return false;
    }
    return true;
  }

  _addFeed(f) {
    const feed = {...f};      
    if (this.validate(feed)) {
      feed.feedId = this.nextFeedId++;    
      this.feeds.push(feed);
      return true;
    }
    return false;
  }

  static isDeleteEnabled(feed) {
    return feed.feedId !== Feeds.DEFAULT_ID &&
      feed.feedId !== Feeds.ADD_ID;
  }

  static getUrl(feed) {
    return feed.url === Feeds.NONE_URL ? null : feed.url;
  }
  
  _expand() {
        
    let expandedFeeds = [...this.feeds];

    // Sort
    expandedFeeds.sort(this.TITLE_SORT); 

    // Default
    expandedFeeds.unshift({
      feedId: Feeds.DEFAULT_ID,
      title: "Default",
      description: "Description goes here.",
      longTitle: "Default Feed",
      url: Feeds.NONE_URL,      
      thumbnail: "images/apps/test/default-feed.png"
    })

    // Add
    expandedFeeds.unshift({
      feedId: Feeds.ADD_ID,
      title: "Add Feed",
      description: "Add Feed",
      longTitle: "Add Feed",
      url: Feeds.NONE_URL,      
      thumbnail: "images/add.png"
    })

    expandedFeeds = this._expandItems(expandedFeeds);

    this.expandedFeeds = expandedFeeds;
  }

  getDistinctFeeds() {
    return this.feeds;
  }

  getFeeds() {
    return this.expandedFeeds;
  }
}

export { Feeds }