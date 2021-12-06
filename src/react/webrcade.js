import React, { Component } from "react";

import {
  getDefaultFeed,
} from '../feed';

import {
  setWebrcade as setFeedsWebrcade,
  deleteFeed,
  parseFeed,
  loadFeed,
  loadInitialFeed
} from './feeds';

import AppBrowseScreen from "./screens/appbrowse";
import Dialogs from "./dialogs";
import LoadingScreen from "./screens/loading";
import { WebrcadeScreenContext } from './context';

import {
  addXboxFullscreenCallback,
  applyIosNavBarHack,
  getXboxViewMessage,
  AppScreen,
  Resources,
  LOG,
  TEXT_IDS,
} from '@webrcade/app-common'

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    setFeedsWebrcade(this);

    this.state = {
      mode: this.ScreenEnum.LOADING,
      loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
      initialFeed: true,
      feeds: null,
      feed: parseFeed(getDefaultFeed()),
      app: null
    };

    this.appScreenFrameRef = React.createRef();
    this.browseScreenRef = React.createRef();

    this.ctx = new WebrcadeScreenContext(this, this.state);
  }

  MIN_LOADING_TIME = 1500;
  MAX_SLIDES_PER_PAGE = 8;
  MIN_SLIDES_LENGTH = (3 * this.MAX_SLIDES_PER_PAGE + 2);
  EDITOR_TEST_FEED = "editor.testFeed";

  HASH_PLAY = "play";
  RP_FEED = "feed";

  ScreenEnum = {
    LOADING: "loading",
    BROWSE: "browse",
    APP: "app"
  }

  LAST_FEED_PROP = "lastfeedId";

  popstateHandler = e => {
    const { appScreenFrameRef, ScreenEnum } = this;
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
          LOG.error(e);
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

  getContext() {
    return this.ctx;
  }

  componentDidMount() {
    const { ScreenEnum } = this;
    const { mode } = this.state;

    // Hack for navigation bar issue on iOS
    applyIosNavBarHack();
    // Hack for Xbox full screen bug
    addXboxFullscreenCallback((show) => {
      if (show) {
        this.ctx.showAlertScreen(true, getXboxViewMessage(), null, false);
      } else {
        this.ctx.showAlertScreen(false);
      }
    });

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
    const { initial, initialFeed, mode } = this.state;
    const { browseScreenRef, ScreenEnum, } = this;

    if (mode === ScreenEnum.LOADING) {
      if (initialFeed) {
        loadInitialFeed();
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
    const { feed, feeds, mode } = this.state;
    const { ctx, browseScreenRef, ScreenEnum, HASH_PLAY } = this;

    return (
      <AppBrowseScreen
        context={ctx}
        feeds={feeds.getFeeds()}
        feed={feed}
        hide={mode !== ScreenEnum.BROWSE}
        disable={ctx.isDialogOpen()}
        ref={browseScreenRef}
        onAppSelected={(app) => {
          window.location.hash = HASH_PLAY;
          this.setState({ mode: ScreenEnum.APP, app: app })
        }}
        onFeedLoad={f => loadFeed(f)}
        onFeedDelete={f => deleteFeed(f)}
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
    const { initialFeed, mode } = this.state;
    const { ScreenEnum } = this;

    return (
      <>
        <Dialogs webrcade={this} />
        {mode === ScreenEnum.LOADING ? this.renderLoading() : null}
        {mode !== ScreenEnum.LOADING || !initialFeed ? this.renderBrowse() : null}
        {mode === ScreenEnum.APP ? this.renderApp() : null}
      </>
    );
  }
}

export default Webrcade;
