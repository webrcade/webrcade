import React, { Component } from "react";

import {
  getDefaultFeed,
  setDefaultFeed,
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
  settings,
  AppScreen,
  FetchAppData,
  Resources,
  APP_FRAME_ID,
  LOG,
  TEXT_IDS,
  config,
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
      app: null,
      browseHidden: false
    };

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
    const { ScreenEnum } = this;
    const { mode } = this.state;

    // Returning to menu
    if (mode === ScreenEnum.APP) {
      const iframe = document.getElementById(APP_FRAME_ID);
      if (iframe) {
        try {
          const content = iframe.contentWindow;
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
        settings.load().finally(() => {
          if (config.isPublicServer()) {
            loadInitialFeed(null);
          } else {
            // Attempt to load default feed from public server
            let feedJson = null;
            let defFeed = null;
            new FetchAppData("https://play.webrcade.com/default-feed.json").fetch()
              .then(response => response.json())
              .then(json => {
                feedJson = json;
                return parseFeed(json)
              })
              .then(feed => {
                // set default feed
                setDefaultFeed(feedJson);
                // set feed here
                defFeed = feed;
              })
              .catch(e => LOG.info(e))
              .finally(() => {
                loadInitialFeed(defFeed);
              })
          }
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

  renderBrowse() {
    const { browseHidden, feed, feeds, mode } = this.state;
    const { ctx, browseScreenRef, ScreenEnum, HASH_PLAY } = this;

    return (
      <AppBrowseScreen
        context={ctx}
        feeds={feeds.getFeeds()}
        feed={feed}
        hide={mode !== ScreenEnum.BROWSE || browseHidden}
        disable={ctx.isDialogOpen()}
        ref={browseScreenRef}
        onAppSelected={(app) => {
          window.location.hash = HASH_PLAY;
          this.setState({ mode: ScreenEnum.APP, app: app, browseHidden: true })
        }}
        onFeedLoad={f => loadFeed(f)}
        onFeedDelete={f => deleteFeed(f)}
        onSettings={() => ctx.showSettingsEditor(true)}
      />
    );
  }

  renderApp() {
    const { app, feed } = this.state;

    return (
      <AppScreen
        app={app}
        feedProps={feed.getProps()}
        exitCallback={() => {
          this.setState({
            browseHidden: false
          })
        }}
      />
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
