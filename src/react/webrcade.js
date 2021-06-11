import React, { Component } from "react";
import { Feed, getDefaultFeed } from '../feed';
import { Feeds } from '../feed';
import {
  UrlUtil,
  FetchAppData,
  applyIosNavBarHack,
  Resources,
  TEXT_IDS
} from '@webrcade/app-common'

import LoadingScreen from "./screens/loading";
import AppBrowseScreen from "./screens/appbrowse"
import AppScreen from "./screens/app";

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    const feeds = new Feeds([
      {
        title: "New Art Feed",
        description: "New Art Feed",
        url: "https://raz0red.github.io/webrcade-design/feed-newart-rev3.json",
        // thumbnail: "images/add.png",
      }
    ], this.MIN_SLIDES_LENGTH);

    this.state = {
      mode: this.ScreenEnum.LOADING,
      loadingStatus: "Loading...",
      initialFeed: true,
      feeds: feeds,
      feed: this.parseFeed(getDefaultFeed()),
      app: null
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
    const { ScreenEnum, MIN_LOADING_TIME, browseScreenRef } = this;

    if (mode === ScreenEnum.LOADING) {
      console.log("## initial feed: " + initialFeed);
      if (initialFeed) {
        const url = window.location.search;
        const feed = UrlUtil.getParam(url, this.RP_FEED);
        if (feed) {
          this.setState({
            loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
            initialFeed: false
          });
          this.loadFeedFromUrl(feed);
        } else {
          setTimeout(() => this.setState({
            mode: ScreenEnum.BROWSE,
            initialFeed: false
          }), MIN_LOADING_TIME);
        }
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
    return new Promise((resolve, reject) => {
      console.log('feed: ' + url);
      const start = Date.now();
      new FetchAppData(url).fetch()
        .then(response => response.json())
        .then(json => this.parseFeed(json))
        .then(feed => {
          if (feed) this.setState({ feed: feed });
          resolve(feed);
        })
        .catch(msg => {
          console.log('Error reading feed: ' + msg);
          reject(msg);
        }) // TODO: Proper logging
        .finally(() => {
          let wait = start + this.MIN_LOADING_TIME - Date.now();
          wait = wait > 0 ? wait : 0;
          setTimeout(() => this.setState({ mode: this.ScreenEnum.BROWSE }), wait);
        });
    });
  }

  loadFeed(feedInfo) {
    console.log('load: ' + JSON.stringify(feedInfo))
    if (feedInfo.feedId === Feeds.ADD_ID) {
      console.log("# Add feed.")
    } else {
      this.setState({
        mode: this.ScreenEnum.LOADING,
        loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
      }, () => {
        if (feedInfo.feedId === Feeds.DEFAULT_ID) {
          setTimeout(() => {
            this.setState({
              mode: this.ScreenEnum.BROWSE,
              feed: this.parseFeed(getDefaultFeed()),
            });
          }, this.MIN_LOADING_TIME);
        } else {
          this.loadFeedFromUrl(feedInfo.url)
            .then(feed => {
              console.log("TODO: Update feed info: " + JSON.stringify(feedInfo));
            })
        }
      });
    }
  }

  renderBrowse() {
    const { feeds, feed, mode } = this.state;
    const { ScreenEnum, browseScreenRef, HASH_PLAY } = this;

    return (
      <AppBrowseScreen
        feeds={feeds.getFeeds()}
        feed={feed}
        hide={mode !== ScreenEnum.BROWSE}
        ref={browseScreenRef}
        onAppSelected={(app) => {
          window.location.hash = HASH_PLAY;
          this.setState({ mode: ScreenEnum.APP, app: app })
        }}
        onFeedLoad={f => this.loadFeed(f)}
        onFeedDelete={f => console.log('delete: ' + JSON.stringify(f))}
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

  render() {
    const { mode } = this.state;
    const { ScreenEnum } = this;

    return (
      <>
        {mode === ScreenEnum.LOADING ? this.renderLoading() : null}
        {mode !== ScreenEnum.LOADING ? this.renderBrowse() : null}
        {mode === ScreenEnum.APP ? this.renderApp() : null}
      </>
    );
  }
}

export default Webrcade;
