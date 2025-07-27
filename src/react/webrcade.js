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
  showMessage,
  AppScreen,
  FetchAppData,
  Resources,
  APP_FRAME_ID,
  LOG,
  TEXT_IDS,
  config,
  dropbox,
  storagePersist
} from '@webrcade/app-common'

require("./style.scss");

// -----------------------------------------------------------------------------
// CUSTOM FEED SUPPORT
// -----------------------------------------------------------------------------
/**
 * Retourne l'URL du feed custom si elle a été injectée via window.CUSTOM_FEED_URL.
 * On filtre les valeurs vides / "undefined" / "null".
 */
const getCustomFeedUrl = () => {
  try {
    const u = window && window.CUSTOM_FEED_URL ? String(window.CUSTOM_FEED_URL).trim() : "";
    return (u && u !== "undefined" && u !== "null") ? u : null;
  } catch (_) {
    return null;
  }
};
// -----------------------------------------------------------------------------

export class Webrcade extends Component {
  constructor() {
    super();

    // Check to ensure resources are resolving
    Resources.check();

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

    // Ask for long term storage
    storagePersist();

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

    let errorMessage = null;
    const displayMessage = (msg) => {
      if (msg) {
        setTimeout(() => {
          showMessage(msg);
        }, 10);
      }
    }

    if (mode === ScreenEnum.LOADING) {
      if (initialFeed) {
        settings.load().finally(() => {
          dropbox.checkLinkResult()
            .catch(e => { errorMessage = e })
            .finally(() => {
              // -----------------------------------------------------------------
              // CUSTOM: on tente d'abord de charger le CUSTOM_FEED_URL si existant
              // -----------------------------------------------------------------
              const customUrl = getCustomFeedUrl();
              const fallbackRemote = "https://play.webrcade.com/default-feed.json";

              const tryFetchFeed = (url) => {
                let feedJson = null;
                let parsedFeed = null;
                return new FetchAppData(url).fetch()
                  .then(response => response.json())
                  .then(json => {
                    feedJson = json;
                    return parseFeed(json);
                  })
                  .then(feed => {
                    // mémorise ce feed comme "default" local (pour l'éditeur, etc.)
                    setDefaultFeed(feedJson);
                    parsedFeed = feed;
                    return parsedFeed;
                  });
              };

              if (config.isPublicServer()) {
                // Mode "public" d'origine : utilise la mécanique existante
                loadInitialFeed(null)
                  .then(() => displayMessage(errorMessage));
              } else {
                // Mode hébergé "privé" : on essaie dans cet ordre :
                // 1. CUSTOM_FEED_URL s'il est défini
                // 2. le feed par défaut distant officiel
                // 3. si tout échoue, loadInitialFeed(null) utilisera le feed embarqué
                const loadChain = (async () => {
                  let defFeed = null;

                  if (customUrl) {
                    try {
                      defFeed = await tryFetchFeed(customUrl);
                    } catch (e) {
                      LOG.warn("Custom feed load failed, falling back to official default.", e);
                    }
                  }

                  if (!defFeed) {
                    try {
                      defFeed = await tryFetchFeed(fallbackRemote);
                    } catch (e) {
                      LOG.info("Official default feed load failed.", e);
                    }
                  }

                  // Quoi qu'il arrive : on continue le flow normal
                  return loadInitialFeed(defFeed);
                })();

                loadChain.then(() => displayMessage(errorMessage));
              }
              // -----------------------------------------------------------------
          })
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
        popstateCallback={() => {
          this.popstateHandler();
        }}
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
