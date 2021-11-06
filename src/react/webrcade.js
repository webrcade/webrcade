import React, { Component } from "react";
import {
  getDefaultFeed,
} from '../feed';
import { storage } from '../storage';
import AddFeedScreen from './screens/addfeed';
import AppBrowseScreen from "./screens/appbrowse";
import AppScreen from "./screens/app";
import LoadingScreen from "./screens/loading";
import YesNoScreen from './screens/yesno';
import {
  applyXboxFullscreenHack,
  applyIosNavBarHack,
  loadFeeds,
  showMessage,
  storeFeeds,
  FetchAppData,
  Feed,
  Feeds,
  Resources,
  UrlUtil,
  LOG,
  TEXT_IDS,
} from '@webrcade/app-common'

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    this.state = {
      mode: this.ScreenEnum.LOADING,
      loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
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

  parseFeed(feedContent) {
    return new Feed(feedContent, this.MIN_SLIDES_LENGTH);
  }

  componentDidMount() {
    const { ScreenEnum } = this;
    const { mode } = this.state;

    // Hack for navigation bar issue on iOS
    applyIosNavBarHack();
    // Hack for Xbox full screen bug
    applyXboxFullscreenHack();

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
    const {
      browseScreenRef,
      ScreenEnum,
      LAST_FEED_PROP,
      MIN_LOADING_TIME,
      MIN_SLIDES_LENGTH
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
              .catch(e => LOG.info(e))
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
    const { ScreenEnum, LAST_FEED_PROP, MIN_LOADING_TIME } = this;
    const { feeds } = this.state;

    LOG.info('feed: ' + url);

    return new Promise((resolve, reject) => {
      const start = Date.now();
      let feedJson = null, newFeed = null;
      let errorMessage = null;
      new FetchAppData(url).fetch()
        .then(response => response.json())
        .then(json => {
          feedJson = json;
          return this.parseFeed(json);
        })
        .then(feed => {
          newFeed = feed;
          storage.put(LAST_FEED_PROP, url).catch(e => LOG.error(e));

          // Add the feed (no-op if already exists)
          feeds.addFeed({ title: "New Feed", url: url });
          // Update the feed          
          if (feeds.updateFeed(url, feedJson)) {
            storeFeeds(feeds);
          }
          resolve([feed, feedJson]);
        })
        .catch(msg => {
          errorMessage = Resources.getText(TEXT_IDS.ERROR_LOADING_FEED);
          reject('Error reading feed: ' + msg);
        })
        .finally(() => {
          let wait = start + MIN_LOADING_TIME - Date.now();
          wait = wait > 0 ? wait : 0;
          setTimeout(() => {
            if (errorMessage) showMessage(errorMessage);
            const newState = { mode: ScreenEnum.BROWSE };
            if (newFeed) newState.feed = newFeed;
            this.setState(newState);
          }, wait);
        });
    });
  }

  loadFeed(feedInfo) {
    const { ScreenEnum, LAST_FEED_PROP, MIN_LOADING_TIME } = this;

    if (feedInfo.feedId === Feeds.ADD_ID) {
      this.setState({ showAddFeedScreen: true });
    } else {
      this.setState({
        mode: ScreenEnum.LOADING,
        loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
      }, () => {
        if (feedInfo.feedId === Feeds.DEFAULT_ID) {
          // Clear the last feed property
          storage.put(LAST_FEED_PROP, "").catch(e => LOG.error(e));
          setTimeout(() => {
            this.setState({
              mode: ScreenEnum.BROWSE,
              feed: this.parseFeed(getDefaultFeed()),
            });
          }, MIN_LOADING_TIME);
        } else {
          this.loadFeedFromUrl(feedInfo.url).catch(e => LOG.info(e));
        }
      });
    }
  }

  renderBrowse() {
    const { feed, feeds, mode, showAddFeedScreen, showYesNoScreen } = this.state;
    const { browseScreenRef, ScreenEnum, HASH_PLAY, LAST_FEED_PROP } = this;

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
            yesNoMessage: Resources.getText(TEXT_IDS.CONFIRM_DELETE_FEED),
            yesNoCallback: (screen) => {
              // Remove feed
              feeds.removeFeed(f.feedId);
              // Update feeds
              storeFeeds(feeds);
              // Remove last feed prop if it matches the deleted feed
              storage.get(LAST_FEED_PROP)
                .then(lastUrl => {                   
                  if (lastUrl && (lastUrl.toUpperCase()  === f.url.toUpperCase())) {
                    LOG.info("Removing last feed URL (was deleted).");
                    return storage.put(LAST_FEED_PROP, "");
                  } else {
                    return null;
                  }
                })
                .catch(e => LOG.error(e))
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
    const { ScreenEnum } = this;
    const { feeds } = this.state;

    return (
      <AddFeedScreen
        onAdd={(screen, url) => {
          if (url.length !== 0) {
            screen.close();
            if (!feeds.getFeedForUrl(url)) {
              this.setState({
                mode: ScreenEnum.LOADING,
                loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
              }, () => {
                this.loadFeedFromUrl(url)
                  .then(([feed, feedJson]) => {
                    feeds.addFeed({ title: "New Feed", url: url });
                    feeds.updateFeed(url, feedJson);
                    storeFeeds(feeds);
                  })
                  .catch(e => LOG.info(e));
              });
            }
          }
        }}
        closeCallback={() => {
          this.setState({ showAddFeedScreen: false });
        }}
      />
    );
  }

  renderYesNo() {
    const { yesNoCallback, yesNoMessage } = this.state;
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
    const { initialFeed, mode, showAddFeedScreen, showYesNoScreen } = this.state;
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
