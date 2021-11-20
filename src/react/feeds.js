import { getDefaultFeed, } from '../feed';
import { storage } from '../storage';
import {
  loadFeeds,
  showMessage,
  storeFeeds,
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

const loadInitialFeed = () => {
  const {
    ScreenEnum, EDITOR_TEST_FEED, LAST_FEED_PROP,
    MIN_LOADING_TIME, MIN_SLIDES_LENGTH
  } = webrcade;

  // Load feeds from storage      
  loadFeeds(MIN_SLIDES_LENGTH)
    .then(feeds => {
      let loadingFeed = false;

      // Do we need to check for a test feed from the editor?
      const editTest = UrlUtil.getParam(
        window.location.search, AppProps.RP_EDITOR_TEST);
      const checkEditTest = (editTest && editTest === AppProps.RV_EDITOR_TEST_ENABLED);

      let lastFeedProp = null;
      storage.get(LAST_FEED_PROP)
        .then(value => { lastFeedProp = value; })
        .then(() => {
          if (checkEditTest) {
            // Load test feed
            return storage.get(EDITOR_TEST_FEED);
          } else {
            return null;
          }
        })
        .then((testFeed) => {
          if (testFeed && testFeed.length > 0) {
            // Using the test feed.
            const feed = parseFeed(JSON.parse(testFeed));

            // Clear the test feed
            storage.put(EDITOR_TEST_FEED, "");

            loadingFeed = true;
            webrcade.setState({
              loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
              initialFeed: false,
              feeds: feeds
            }, () => {
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
          if (!usingTestFeed) {
            // Check request parameter for feed url
            let feed = UrlUtil.getParam(window.location.search, webrcade.RP_FEED);
            if (!feed) {
              // Check last feed url
              feed = lastFeedProp;
            }
            if (feed && feed.length > 0) {
              loadingFeed = true;
              webrcade.setState({
                loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
                initialFeed: false,
                feeds: feeds
              });
              return loadFeedFromUrl(feed);
            }
          }
        })
        .catch(e => LOG.info(e))
        .finally(() => {
          if (!loadingFeed) {
            setTimeout(() => webrcade.setState({
              mode: ScreenEnum.BROWSE,
              initialFeed: false,
              feeds: feeds
            }), MIN_LOADING_TIME);
          }
        });
    });
}

const loadFeedFromUrl = (url) => {
  const { ScreenEnum, LAST_FEED_PROP, MIN_LOADING_TIME } = webrcade;
  const { feeds } = webrcade.state;

  LOG.info('feed: ' + url);

  return new Promise((resolve, reject) => {
    const start = Date.now();
    let feedJson = null, newFeed = null;
    let errorMessage = null;
    new FetchAppData(url).fetch()
      .then(response => response.json())
      .then(json => {
        feedJson = json;
        return parseFeed(json);
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
        loadFeedFromUrl(feedInfo.url).catch(e => LOG.info(e));
      }
    });
  }
}

const deleteFeed = (feed, feeds) => {
  const { LAST_FEED_PROP } = webrcade;

  webrcade.getContext().showYesNoScreen(true,
    Resources.getText(TEXT_IDS.CONFIRM_DELETE_FEED),
    (screen) => {
      // Remove feed
      feeds.removeFeed(feed.feedId);
      // Update feeds
      storeFeeds(feeds);
      // Remove last feed prop if it matches the deleted feed
      storage.get(LAST_FEED_PROP)
        .then(lastUrl => {
          if (lastUrl && (lastUrl.toUpperCase() === feed.url.toUpperCase())) {
            LOG.info("Removing last feed URL (was deleted).");
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
  deleteFeed, 
  loadFeed,
  loadFeedFromUrl,
  loadInitialFeed,
  parseFeed
}