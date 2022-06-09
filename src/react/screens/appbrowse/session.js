const SESSION_LAST_FEED = "wrc.lastFeed";
const SESSION_LAST_CATEGORY = "wrc.lastCategory";
const SESSION_LAST_ITEM = "wrc.lastItem";


function clearLastItem() {
  sessionStorage.removeItem(SESSION_LAST_FEED);
  sessionStorage.removeItem(SESSION_LAST_CATEGORY);
  sessionStorage.removeItem(SESSION_LAST_ITEM);
}

function getLastFeedTitle() {
  try {
    return sessionStorage.getItem(SESSION_LAST_FEED);
  } catch (e) {} 
  return null;
}

function getLastCategoryTitle() {
  try {
    return sessionStorage.getItem(SESSION_LAST_CATEGORY);
  } catch (e) {} 
  return null;
}

function getLastItemTitle() {
  try {
    return sessionStorage.getItem(SESSION_LAST_ITEM);
  } catch (e) {} 
  return null;
}

function setLastItem(feedTitle, categoryTitle, itemTitle) {
  if (feedTitle && categoryTitle && itemTitle) {
    sessionStorage.setItem(SESSION_LAST_FEED, feedTitle);
    sessionStorage.setItem(SESSION_LAST_CATEGORY, categoryTitle);
    sessionStorage.setItem(SESSION_LAST_ITEM, itemTitle);
  } else {
    clearLastItem();
  }
}


export {
  clearLastItem,
  getLastCategoryTitle,
  getLastFeedTitle,
  getLastItemTitle,
  setLastItem,
}
