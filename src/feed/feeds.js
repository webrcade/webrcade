import { storage } from '../storage'
import { FeedBase } from './feedbase.js'
import { LOG } from '@webrcade/app-common'

const FEEDS_PROP = "feeds";

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

  updateFeed(url, feed) {
    const index = this._getFeedIndexForUrl(url);
    let changed = false;
    if (index >= 0) {
      const f = this.feeds[index];
      const props = [
        'title', 'longTitle', 'description', 'thumbnail', 'background'
      ]
      props.forEach(p => {
        if (f[p] !== feed[p]) {
          changed = true;
          if (feed[p]) {
            f[p] = feed[p];
          } else {
            delete f[p];
          }
        }
      });
    }
    if (changed) {
      this._expand();
    }
    return changed;
  }

  addFeed(f) {
    if (f && f.url) {
      const index = this._getFeedIndexForUrl(f.url);
      if (index >= 0) return;
    }
    if (this._addFeed(f)) {
      this._expand();
    }    
  }

  _getFeedIndexForUrl(url) {
    const index = this.feeds.findIndex(
      feed => feed.url.toUpperCase() === url.toUpperCase());
    return index;
  }

  getFeedForUrl(url) {
    const index = this._getFeedIndexForUrl(url);
    return index !== -1 ? this.feeds[index] : null;
  }

  removeFeed(feedId) {
    const index = this.feeds.findIndex(f => {
      return f.feedId === feedId;
    });
    if (index >= 0) {
      this.feeds.splice(index, 1);
      this._expand();
    }
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

const loadFeeds = async (minSlidesLength) => {  
  try {
    const feedsProp = await storage.get(FEEDS_PROP);
    return new Feeds(feedsProp ? feedsProp : [], minSlidesLength);
  } catch(e) {
    LOG.error("Error reading feeds: " + e); 
    return new Feeds([], minSlidesLength);
  }
}

const storeFeeds = async (feeds) => {
  const outFeeds = [];  
  feeds.getDistinctFeeds().forEach(e => {
    const f = {...e};
    delete f.feedId;
    outFeeds.push(f);
  });
  try {
    await storage.put(FEEDS_PROP, outFeeds);
  } catch (e) {
    LOG.error("Error storing feeds: " + e);
  }
}

export { Feeds, loadFeeds, storeFeeds }