import { AppRegistry } from '../apps'
import { FeedBase } from './feedbase.js'

class Feed extends FeedBase {
  constructor(feed, minLength) {
    super(minLength);
    this._parseFeed(feed);
  }

  _parseFeed(feed) {
    const reg = AppRegistry.instance;

    // Ensure categories are available
    let categories = feed.categories;

    if (categories === undefined) {
      throw new Error("Missing categories");
    }

    // Filter categories
    categories = categories.filter(c => {
      if (c.title === undefined) {
        this._logInvalidObject('Category missing title', c);
        return false;
      } else if (c.items === undefined || c.items.length === 0) {
        this._logInvalidObject('Category missing items', c);
        return false;
      }
      return true;
    });    

    // Filter and expand category items
    categories.forEach(category => {      
      category.items = this._expandItems(
        category.items.filter(a => {
          try {
            reg.validate(a);
          } catch (e) {
            this._logInvalidObject('App is invalid: ' + e, a);
            return false;
          }
          return true;
        }).sort(this.TITLE_SORT)
      );      
    }); 

    this.uniqueCategoryCount = categories.length;

    // Expand valid categories
    categories = this._expandItems(categories.filter(c => {
      return c.items.length > 0;
    }));
    if (categories.length === 0) {
      throw new Error("No valid categories found.");
    }
    this.categories = categories;
  }

  getCategories() { return this.categories; }

  getUniqueCategoryCount() { return this.uniqueCategoryCount; }

  getApps(categoryId) { 
    const category = this.categories.filter(c => c.id === categoryId);
    if (category.length > 0) {
      return category[0].items;
    }    
    throw new Error(`Unable to find category with id: ${categoryId}`);
  }
}

export { Feed }

