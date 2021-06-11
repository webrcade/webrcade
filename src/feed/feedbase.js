class FeedBase {
  constructor(minLength) {
    this.minLength = minLength;  
  }

  TITLE_SORT = (a, b) => a.title.localeCompare(b.title);

  _logInvalidObject(msg, object) {
    console.info(msg + " : " + JSON.stringify(object));
  }

  _expandItems(items) {
    const { minLength } = this;

    if (items.length === 0) return items;

    let itemsOut = [], index = [0];
    while (itemsOut.length < minLength) {
      items.forEach(i => {
        const {...item} = i;
        item.id = index[0]++;
        itemsOut.push(item);
        if (itemsOut.length > items.length) {
          item.duplicate = true;
        }
      });
    }
    return itemsOut;    
  }
}

export { FeedBase }