import React, { Component } from "react";
import { Feed, getDefaultFeed, Feeds, loadFeeds, storeFeeds } from '../feed';
import { storage } from '../storage';
import {
  FetchAppData,
  applyIosNavBarHack,
  Resources,
  TEXT_IDS,
  UrlUtil
} from '@webrcade/app-common'

import LoadingScreen from "./screens/loading";
import AppBrowseScreen from "./screens/appbrowse";
import AppScreen from "./screens/app";
import AddFeedScreen from './screens/addfeed';
import YesNoScreen from './screens/yesno';

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    this.state = {
      mode: this.ScreenEnum.LOADING,
      loadingStatus: Resources.getText(TEXT_IDS.LOADING_DOTS),
      initialFeed: true,
      feeds: null,
      feed: this.parseFeed(getDefaultFeed()),
      app: null,
      showAddFeedScreen: false,
      renderYesNoScreen: false,
      yesNoMessage: "",
      yesNoCallback: null
    };

    this.appScreenFrameRef = React.createRef();
    this.browseScreenRef = React.createRef();
  }

  MIN_LOADING_TIME = 1500;
  MAX_SLIDES_PER_PAGE = 8;
  MIN_SLIDES_LENGTH = (3 * this.MAX_SLIDES_PER_PAGE + 2);

  HASH_PLAY = "play";
  RP_FEED = "feed";

  ScreenEnum = {
    LOADING: "loading",
    BROWSE: "browse",
    APP: "app"
  }

  LAST_FEED_PROP = "lastfeed";

  popstateHandler = e => {
    const { ScreenEnum, appScreenFrameRef } = this;
    const { mode } = this.state;

    // Returning to menu
    if (mode === ScreenEnum.APP) {
      if (appScreenFrameRef.current) {
        try {
          const content = appScreenFrameRef.current.contentWindow;
          if (content) {
            content.postMessage("exit", "*");
          }
        } catch (e) {
          // TODO: Proper error handling
          console.error(e);
        }
      }
    }
  }

  messageListener = e => {
    const { ScreenEnum } = this;
    if (e.data === 'exitComplete') {
      this.setState({ mode: ScreenEnum.BROWSE });
    }
  }

  parseFeed(feedContent) {
    return new Feed(feedContent, this.MIN_SLIDES_LENGTH);
  }

  componentDidMount() {
    const { ScreenEnum } = this;
    const { mode } = this.state;

    // Hack for navigation bar issue on iOS
    applyIosNavBarHack();

    window.addEventListener('popstate', this.popstateHandler, false);
    window.addEventListener("message", this.messageListener);

    // Clear hash if displaying menu
    const hash = window.location.href.indexOf('#');
    if (mode !== ScreenEnum.APP && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }

    this.setState({ initial: true });
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstateHandler);
    window.removeEventListener("message", this.messageListener);
  }

  componentDidUpdate(prevProps, prevState) {
    const { mode, initial, initialFeed } = this.state;
    const {
      ScreenEnum,
      MIN_LOADING_TIME,
      MIN_SLIDES_LENGTH,
      LAST_FEED_PROP,
      browseScreenRef
    } = this;

    if (mode === ScreenEnum.LOADING) {      
      if (initialFeed) {
        // Load feeds from storage      
        loadFeeds(MIN_SLIDES_LENGTH)
          .then(feeds => {
            let loadingFeed = false;
            storage.get(LAST_FEED_PROP)
              .then(f => {
                // Check request parameter for feed url
                let feed = UrlUtil.getParam(window.location.search, this.RP_FEED);
                if (!feed) {
                  // Check last feed url
                  feed = f;
                }    
                if (feed && feed.length > 0) {
                  loadingFeed = true;
                  this.setState({
                    loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
                    initialFeed: false,
                    feeds: feeds
                  });
                  return this.loadFeedFromUrl(feed);
                }
              })
              .catch(e => console.error(e)) // TODO: Proper error handling
              .finally(() => {
                if (!loadingFeed) {
                  setTimeout(() => this.setState({
                    mode: ScreenEnum.BROWSE,
                    initialFeed: false,
                    feeds: feeds
                  }), MIN_LOADING_TIME);
                }
              });
          });
      }
    } else if (initial ||
      (prevState.mode === ScreenEnum.APP && mode === ScreenEnum.BROWSE)) {
      this.setState({ initial: false });
      setTimeout(() => {
        window.focus();
        browseScreenRef.current.focus();
      }, 0);
    }
  }

  loadFeedFromUrl(url) {
    const { 
      MIN_LOADING_TIME, 
      LAST_FEED_PROP, 
      ScreenEnum 
    } = this;
    const {
      feeds
    } = this.state;

    console.log('feed: ' + url);
    return new Promise((resolve, reject) => {      
      const start = Date.now();
      let feedJson = null, newFeed = null;
      new FetchAppData(url).fetch()
        .then(response => response.json())
        .then(json => {
          feedJson = json;
          return this.parseFeed(json);
        })
        .then(feed => {
          newFeed = feed;
          storage.put(LAST_FEED_PROP, url)
            .catch(e => console.error(e)); // TODO: Proper error handling
          if (feeds.updateFeed(url, feedJson)) {            
            storeFeeds(feeds);
          }
          resolve(feed);
        })
        .catch(msg => {
          console.log('Error reading feed: ' + msg); // TODO: Proper logging
          reject(msg);
        }) 
        .finally(() => {
          let wait = start + MIN_LOADING_TIME - Date.now();
          wait = wait > 0 ? wait : 0;
          setTimeout(() => {
            const newState = { mode: ScreenEnum.BROWSE };
            if (newFeed) {
              newState.feed = newFeed;
            }
            this.setState(newState);
          }, wait);
        });
    });
  }

  loadFeed(feedInfo) {
    const { 
      MIN_LOADING_TIME, 
      LAST_FEED_PROP, 
      ScreenEnum 
    } = this;

    console.log('load: ' + JSON.stringify(feedInfo))
    if (feedInfo.feedId === Feeds.ADD_ID) {
      this.setState({ showAddFeedScreen: true });
    } else {
      this.setState({
        mode: ScreenEnum.LOADING,
        loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
      }, () => {
        if (feedInfo.feedId === Feeds.DEFAULT_ID) {
          // Clear the last feed property
          storage.put(LAST_FEED_PROP, "")
            .catch(e => console.error(e)); // TODO: Proper error handling
          setTimeout(() => {
            this.setState({
              mode: ScreenEnum.BROWSE,
              feed: this.parseFeed(getDefaultFeed()),
            });
          }, MIN_LOADING_TIME);
        } else {
          this.loadFeedFromUrl(feedInfo.url)
            .catch(e => console.error(e)) // TODO: Proper error handling
        }
      });
    }
  }

  renderBrowse() {
    const { feeds, feed, mode, showAddFeedScreen, showYesNoScreen } = this.state;
    const { ScreenEnum, browseScreenRef, HASH_PLAY } = this;

    return (
      <AppBrowseScreen
        feeds={feeds.getFeeds()}
        feed={feed}
        hide={mode !== ScreenEnum.BROWSE}
        disable={showAddFeedScreen || showYesNoScreen}
        ref={browseScreenRef}
        onAppSelected={(app) => {
          window.location.hash = HASH_PLAY;
          this.setState({ mode: ScreenEnum.APP, app: app })
        }}
        onFeedLoad={f => this.loadFeed(f)}
        onFeedDelete={f => {
          this.setState({
            showYesNoScreen: true,
            yesNoMessage: "Are you sure you want to delete the selected feed?",
            yesNoCallback: (screen) => {
              feeds.removeFeed(f.feedId);
              storeFeeds(feeds);
              screen.close();
            }
          });
        }}
      />
    );
  }

  renderApp() {
    const { appScreenFrameRef } = this;
    const { app } = this.state;

    return (
      <AppScreen app={app} frameRef={appScreenFrameRef} />
    );
  }

  renderLoading() {
    const { loadingStatus } = this.state;

    return (
      <LoadingScreen text={loadingStatus} />
    );
  }

  renderAddFeed() {
    const { feeds } = this.state;
    return (
      <AddFeedScreen
        onAdd={(screen, url) => {
          if (url.length !== 0) {
            if (!feeds.getFeedForUrl(url)) {
              feeds.addFeed({
                title: "Test",
                description: "Test",
                url: url
              });
              storeFeeds(feeds);
            }
          }
          screen.close();
        }}
        closeCallback={() => {
          this.setState({ showAddFeedScreen: false });
        }}
      />
    );
  }

  renderYesNo() {
    const { yesNoMessage, yesNoCallback } = this.state;
    return (
      <YesNoScreen
        height="10rem"
        message={yesNoMessage}
        onYes={yesNoCallback}
        closeCallback={() => {
          this.setState({ showYesNoScreen: false });
        }}
      />
    );
  }

  render() {
    const { mode, showAddFeedScreen, showYesNoScreen, initialFeed } = this.state;
    const { ScreenEnum } = this;

    return (
      <>
        {showYesNoScreen ? this.renderYesNo() : null}
        {showAddFeedScreen ? this.renderAddFeed() : null}
        {mode === ScreenEnum.LOADING ? this.renderLoading() : null}
        {mode !== ScreenEnum.LOADING || !initialFeed ? this.renderBrowse() : null}
        {mode === ScreenEnum.APP ? this.renderApp() : null}
      </>
    );
  }
}

export default Webrcade;
