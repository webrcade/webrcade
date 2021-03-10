import { AppRegistry } from '../apps'

class WebrcadeFeed {
  constructor(feed, minLength) {
    this.minLength = minLength;
    this.parseFeed(feed);
  }

  TITLE_SORT = (a, b) => a.title.localeCompare(b.title);

  logInvalidObject(msg, object) {
    console.info(msg + ":");
    console.info(object);      
  }

  parseFeed(feed) {
    const reg = AppRegistry.instance;

    // Ensure categories are available
    let categories = feed.categories;

    if (categories === undefined) {
      throw new Error("Missing categories");
    }

    // Filter categories
    categories = categories.filter(c => {
      if (c.title === undefined) {
        this.logInvalidObject('category missing title', c);
        return false;
      } else if (c.items === undefined || c.items.length === 0) {
        this.logInvalidObject('category missing items', c);
        return false;
      }
      return true;
    });    

    // Filter and expand category items
    categories.forEach(category => {      
      category.items = this.expandItems(
        category.items.filter(a => {
          try {
            reg.validate(a);
          } catch (e) {
            this.logInvalidObject('item is invalid: ' + e, a);
            return false;
          }
          return true;
        }).sort(this.TITLE_SORT)
      );      
    }); 

    // Expand valid categories
    categories = this.expandItems(categories.filter(c => {
      return c.items.length > 0;
    }));
    if (categories.length === 0) {
      throw new Error("No valid categories found.");
    }
    this.categories = categories;
  }

  expandItems(items) {
    const { minLength } = this;

    if (items.length === 0) return items;

    let itemsOut = [], index = [0];
    while (itemsOut.length < minLength) {
      items.forEach(i => {
        const {...item} = i;
        item.id = index[0]++;
        itemsOut.push(item);
      });
    }
    return itemsOut;    
  }

  getCategories() { return this.categories; }

  getApps(categoryId) { 
    const category = this.categories.filter(c => c.id === categoryId);
    if (category.length > 0) {
      return category[0].items;
    }    
    throw new Error(`Unable to find category with id: ${categoryId}`);
  }
}

export { WebrcadeFeed };

