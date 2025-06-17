import { getDefaultFeed, } from '../feed';
import { storage } from '../storage';
import {
  getFeedAsJson,
  loadFeeds,
  showMessage,
  AppProps,
  Feed,
  Feeds,
  FetchAppData,
  Resources,
  UrlUtil,
  LOG,
  TEXT_IDS,
} from '@webrcade/app-common'

let webrcade = null;

const loadInitialFeed = (defaultFeed) => {
  return new Promise((resolve, reject) => {
    const {
      ScreenEnum,
      EDITOR_TEST_FEED,
      LAST_FEED_PROP,
      MIN_LOADING_TIME,
      MIN_SLIDES_LENGTH
    } = webrcade;

    // Load feeds from storage
    loadFeeds(MIN_SLIDES_LENGTH)
      .then(feeds => {
        let loadingFeed = false;

        // Do we need to check for a test feed from the editor?
        const editTest = UrlUtil.getParam(
          window.location.search, AppProps.RP_EDITOR_TEST);
        const checkEditTest = (editTest && editTest === AppProps.RV_EDITOR_TEST_ENABLED);

        // Capture the last feed identifier
        let lastFeedId = null;
        storage.get(LAST_FEED_PROP)
          .then(value => { lastFeedId = value; })
          .then(() => {
            if (checkEditTest) {
              // Get the test feed from storage (if applicable)
              return storage.get(EDITOR_TEST_FEED);
            } else {
              return null;
            }
          })
          .then((testFeed) => {
            if (testFeed) {
              // Test feed was found, use it
              const feed = parseFeed(testFeed);
              // Clear the test feed
              storage.put(EDITOR_TEST_FEED, "");
              // Mark that we are going to be loading a feed
              loadingFeed = true;
              // Show the loading screen
              webrcade.setState({
                loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
                initialFeed: false,
                feeds: feeds
              }, () => {
                // After loading screen, set to the test feed
                webrcade.setState({
                  feed: feed,
                  mode: ScreenEnum.BROWSE
                });
              });
              return true;
            } else {
              return false;
            }
          })
          .then((usingTestFeed) => {
            // If we are not using the test feed
            if (!usingTestFeed) {
              // Check request parameter for feed url
              const feedUrl = UrlUtil.getParam(window.location.search, webrcade.RP_FEED);
              // If a Feed URL was specified or a last feed was found
              if ((feedUrl && feedUrl.length > 0) || lastFeedId) {
                webrcade.setState({
                  loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
                  initialFeed: false,
                  feeds: feeds
                });

                if (feedUrl) {
                  // Load the feed URL that was specified
                  loadingFeed = true;
                  return loadFeedFromUrl(feedUrl);
                } else {
                  // Attempt to find the feed associated with the feedId
                  const feed = feeds.getFeedWithId(lastFeedId);
                  if (feed) {
                    if (feed.url && feed.url.length > 0) {
                      loadingFeed = true;
                      return loadFeedFromUrl(feed.url);
                    } else if (feed.localId) {
                      loadingFeed = true;
                      return loadFeedFromLocal(feed);
                    }
                  }
                }
              }
            }
          })
          .catch(e => LOG.info(e))
          .finally(() => {
            if (!loadingFeed) {
              const nextState = {
                mode: ScreenEnum.BROWSE,
                initialFeed: false,
                feeds: feeds
              };
              if (defaultFeed) {
                nextState.feed = defaultFeed;
              }
              setTimeout(() => {
                webrcade.setState(nextState, () => { resolve() })
              }, MIN_LOADING_TIME);
            } else {
              resolve();
            }
          });
      });
    });
}

const addLocalFeed = (file) => {
  const {
    ScreenEnum,
    MIN_LOADING_TIME,
    MIN_SLIDES_LENGTH
  } = webrcade;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    webrcade.setState({
      mode: ScreenEnum.LOADING,
      loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
    }, () => {
      let feedJson = null;
      let feedObj = null;
      getFeedAsJson(file)
        .then(feed => { console.log(feed); feedJson = feed; return parseFeed(feed); })
        .then(fo => {
          feedObj = fo;
          // Load feeds again (may have been updated externally)
          return loadFeeds(MIN_SLIDES_LENGTH);
        })
        .then(newFeeds => {
          webrcade.setState({feeds: newFeeds});
          return newFeeds.addLocalFeed(feedJson);
        })
        .then(localFeed => loadFeedFromLocal(localFeed))
        .then(() => resolve(feedObj))
        .catch(msg => {
          LOG.error(msg);
          let wait = start + MIN_LOADING_TIME - Date.now();
          wait = wait > 0 ? wait : 0;
          setTimeout(() => {
            showMessage(Resources.getText(TEXT_IDS.ERROR_LOADING_FEED));
            webrcade.setState({ mode: ScreenEnum.BROWSE });
          }, wait);
          reject('Error reading feed: ' + msg);
        })
    })
  })
}

const loadFeedFromLocal = (localFeed) => {
  const { ScreenEnum, LAST_FEED_PROP, MIN_LOADING_TIME } = webrcade;
  const { feeds } = webrcade.state;

  return new Promise((resolve, reject) => {
    if (!localFeed.localId) {
      reject("Unable to find local feed identifier in feed.");
    }

    const start = Date.now();
    let newFeed = null;
    let errorMessage = null;
    // TODO: If feed has been deleted, gets error during parse (NPE)
    feeds.getLocalFeed(localFeed.localId)
      .then(feed => parseFeed(feed))
      .then(feed => {
        if (localFeed.feedId) {
          storage.put(
            LAST_FEED_PROP, localFeed.feedId
          ).catch(e => LOG.error(e));
        }
        newFeed = feed;
        resolve(newFeed);
      })
      .catch(msg => {
        LOG.error(msg);
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
          webrcade.setState(newState);
        }, wait);
      });
  });
}

const loadFeedFromUrl = (url, addPrefix = true) => {
  const {
    ScreenEnum,
    LAST_FEED_PROP,
    MIN_LOADING_TIME,
    MIN_SLIDES_LENGTH
  } = webrcade;

  LOG.info('feed: ' + url);

  const newState = {
    mode: ScreenEnum.BROWSE
  }
  return new Promise((resolve, reject) => {
    const start = Date.now();
    let feedJson = null, newFeed = null;
    let errorMessage = null;
    new FetchAppData(url, addPrefix).fetch()
      .then(response => response.blob())
      .then(blob => getFeedAsJson(blob))
      .then(json => {
        feedJson = json;
        return parseFeed(json);
      })
      .then(feed => {
        newFeed = feed;
        return feed;
      })
      // Reload feeds (may have been changed externally)
      .then(() => loadFeeds(MIN_SLIDES_LENGTH))
      .then((feeds) => {
        newState.feeds = feeds;
        return feeds.addRemoteFeed(url, feedJson);
      })
      .then(addedFeed => {
        if (addedFeed && addedFeed.feedId) {
          storage.put(
            LAST_FEED_PROP, addedFeed.feedId
          ).catch(e => LOG.error(e));
        }
        resolve([newFeed, feedJson]);
      })
      .catch(msg => {
        LOG.error(msg);
        errorMessage = Resources.getText(TEXT_IDS.ERROR_LOADING_FEED);
        reject('Error reading feed: ' + msg);
      })
      .finally(() => {
        let wait = start + MIN_LOADING_TIME - Date.now();
        wait = wait > 0 ? wait : 0;
        setTimeout(() => {
          if (errorMessage) showMessage(errorMessage);
          if (newFeed) {
            newState.feed = newFeed;
          }
          webrcade.setState(newState);
        }, wait);
      });
  });
}

const loadFeed = (feedInfo) => {
  const { ScreenEnum, LAST_FEED_PROP, MIN_LOADING_TIME } = webrcade;

  if (feedInfo.feedId === Feeds.ADD_ID) {
    webrcade.getContext().showAddFeedScreen(true);
  } else {
    webrcade.setState({
      mode: ScreenEnum.LOADING,
      loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
    }, () => {
      if (feedInfo.feedId === Feeds.DEFAULT_ID) {
        // Clear the last feed property
        storage.put(LAST_FEED_PROP, "").catch(e => LOG.error(e));
        setTimeout(() => {
          webrcade.setState({
            mode: ScreenEnum.BROWSE,
            feed: parseFeed(getDefaultFeed()),
          });
        }, MIN_LOADING_TIME);
      } else {
        if (feedInfo.url) {
          loadFeedFromUrl(feedInfo.url).catch(e => LOG.error(e));
        } else {
          loadFeedFromLocal(feedInfo).catch(e => LOG.error(e));
        }
      }
    });
  }
}

const deleteFeed = (feed) => {
  const { LAST_FEED_PROP, MIN_SLIDES_LENGTH } = webrcade;

  webrcade.getContext().showYesNoScreen(true,
    Resources.getText(TEXT_IDS.CONFIRM_DELETE_FEED),
    async (screen) => {
      // Remove feed
      try {
        // Reload feeds prior to deletion (may have been modified externally)
        const newFeeds = await loadFeeds(MIN_SLIDES_LENGTH);
        if (newFeeds) {
          await newFeeds.removeFeed(feed.feedId);
          webrcade.setState({
            feeds: newFeeds
          })
        }
      } catch (e) {
        LOG.error(e);
        showMessage(Resources.getText(TEXT_IDS.ERROR_DELETING_FEED));
      }

      // Remove last feed prop if it matches the deleted feed
      storage.get(LAST_FEED_PROP)
        .then(lastFeedId => {
          if (lastFeedId && (lastFeedId === feed.feedId)) {
            LOG.info("Removing last feed (was deleted).");
            return storage.put(LAST_FEED_PROP, "");
          } else {
            return null;
          }
        })
        .catch(e => LOG.error(e))
      screen.close();
    }
  );
}

const parseFeed = (feedContent) => {
  return new Feed(feedContent, webrcade.MIN_SLIDES_LENGTH);
}

const setWebrcade = (wrc) => {
  webrcade = wrc;
}

export {
  setWebrcade,
  addLocalFeed,
  deleteFeed,
  loadFeed,
  loadFeedFromUrl,
  loadInitialFeed,
  parseFeed
}