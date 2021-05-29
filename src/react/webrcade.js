import React, { Component } from "react";
import { Feed, getDefaultFeed } from '../feed';
import { Feeds } from '../feed';
import { 
  UrlUtil, 
  FetchAppData, 
  applyIosNavBarHack 
} from '@webrcade/app-common'

import LoadingScreen from "./screens/loading";
import AppBrowseScreen from "./screens/appbrowse"
import AppScreen from "./screens/app";

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    this.state = {
      mode: this.ScreenEnum.LOADING,
      loadingStatus: "Loading...",
      initialFeed: true,
      feeds: new Feeds([
        {
          name: "feed1", 
          url: "url",
          thumbnail: "images/games/2600/asteroids-thumb.png"
        }, {
          name: "feed2", 
          url: "url2",
          thumbnail: "images/games/2600/atlantis-thumb.png"
        }
      ]),
      feed: this.parseFeed(getDefaultFeed()),
      app: null
    };

    this.appScreenFrameRef = React.createRef();
    this.browseScreenRef = React.createRef();
  }

  MIN_LOADING_TIME = 1500;
  MAX_SLIDES = 8;

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
    return new Feed(feedContent, (3 * this.MAX_SLIDES + 2));
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

    const start = Date.now();
    if (mode === ScreenEnum.LOADING) {
      if (initialFeed) {
        const url = window.location.search;
        const feed = UrlUtil.getParam(url, this.RP_FEED);
        if (feed) {
          console.log('feed: ' + feed);

          this.setState({
            loadingStatus: "Loading feed...",
            initialFeed: false
          });

          new FetchAppData(feed).fetch()
            .then(response => response.json())
            .then(json => this.parseFeed(json))
            .then(feed => { if (feed) this.setState({ feed: feed }) })
            .catch(msg => console.log('Error reading feed: ' + msg)) // TODO: Proper logging
            .finally(() => {
              let wait = start + MIN_LOADING_TIME - Date.now();
              wait = wait > 0 ? wait : 0;
              setTimeout(() => this.setState({ mode: ScreenEnum.BROWSE }), wait);
            })
        } else {
          setTimeout(() => this.setState({ mode: ScreenEnum.BROWSE }),
            MIN_LOADING_TIME);
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

  renderBrowse() {
    const { feed, mode } = this.state;
    const { ScreenEnum, browseScreenRef, HASH_PLAY } = this;

    return (
      <AppBrowseScreen
        feed={feed}
        hide={mode !== ScreenEnum.BROWSE} 
        ref={browseScreenRef}
        onAppSelected={(app) => {
          window.location.hash = HASH_PLAY;
          this.setState({ mode: ScreenEnum.APP, app: app })
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
