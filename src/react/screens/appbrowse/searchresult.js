import {
  AppRegistry,
  PlayArrowBlackImage,
  PlayArrowWhiteImage,
  uuidv4,
} from '@webrcade/app-common'

import * as Session from "./session"

const getSearchItemInfo = (appBrowse, currentItem) => {
  const { sliderRef, ModeEnum } = appBrowse;
  const { onAppSelected, feed } = appBrowse.props;
  const reg = AppRegistry.instance;

  // Use the category tagged on the search result item, with fallback
  const category = currentItem._category || appBrowse.state.category;

  return {
    title: reg.getLongTitle(currentItem),
    subTitle: reg.getName(currentItem),
    description: reg.getDescription(currentItem),
    backgroundSrc: reg.getBackground(currentItem),
    backgroundPixelated: currentItem.backgroundPixelated,
    defaultBackgroundSrc: reg.getDefaultBackground(currentItem),
    categoryLabel: "Search Results",
    flyoutLabel: "Show Categories",
    button1Label: "PLAY",
    button1Img: PlayArrowBlackImage,
    button1HoverImg: PlayArrowWhiteImage,
    isButton2Enabled: false,
    getTitle: item => reg.getTitle(item),
    getThumbnailSrc: item => reg.getThumbnail(item),
    getDefaultThumbnailSrc: item => reg.getDefaultThumbnail(item),
    onClick: () => {
      if (onAppSelected) onAppSelected(currentItem);
      if (category) Session.setLastItem(feed.getTitle(), category.title, currentItem.title);
    },
    categoryOnClick: () => {
      appBrowse.clearSearch();
      appBrowse.setState({
        currentItem: feed.getCategories()[0],
        menuMode: ModeEnum.CATEGORIES
      }, () => { setTimeout(() => { Session.clearLastItem(); }, 0)});
      sliderRef.current.focus();
    }
  };
};

export default getSearchItemInfo;

const getSearchItems = (feed, searchTerm, maxSlides, cache) => {
  if (!feed || !searchTerm) return { items: [], cache };

  if (cache && cache.term === searchTerm && cache.feed === feed) {
    return { items: cache.items, cache };
  }

  const searchLower = searchTerm.toLowerCase();
  const result = [];
  feed.getUniqueCategories().forEach(category => {
    category.items.forEach(item => {
      if (item.title.toLowerCase().includes(searchLower)) {
        result.push({ ...item, id: uuidv4(), _origId: item.id, _category: category });
      }
    });
  });
  result.sort((a, b) => a.title.localeCompare(b.title));

  // Pad results to minLength the same way _expandItems does for category items.
  // The slider's index math requires at least (3 * maxSlides + 2) items.
  const minLength = 3 * maxSlides + 2;
  if (result.length > 0 && result.length < minLength) {
    const padded = [];
    while (padded.length < minLength) {
      result.forEach(i => {
        const item = { ...i };
        item.id = uuidv4();
        padded.push(item);
        if (padded.length > result.length) {
          item.duplicate = true;
        }
      });
    }
    const newCache = { term: searchTerm, feed, items: padded };
    return { items: padded, cache: newCache };
  }

  const newCache = { term: searchTerm, feed, items: result };
  return { items: result, cache: newCache };
};

export { getSearchItems };
