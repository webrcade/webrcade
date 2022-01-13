import DEFAULT_FEED from './default-feed.json'
import { config, isDev } from '@webrcade/app-common'

const EMPTY_FEED = {
  title: "Empty Feed",
  categories: [
    {
      title: "Empty Category",
      items: [
        {
          title: "Empty Item",
          type: "2600",
          props: {
            rom: "http://127.0.0.1/no-place-like"
          }
        }
      ]
    }
  ]
};

let defaultFeed = EMPTY_FEED;

const getImage = (url) => {
  return url;
}

const getRom = (url) => {
  return (isDev() ? 
    (config.getLocalUrl() + "/") : 
    (config.getRawContentRoot() ? config.getRawContentRoot() : "../../" )) + url;
}

const getDefaultFeed = () => {
  return JSON.parse(JSON.stringify(defaultFeed));
};

const setDefaultFeed = (feed) => {
  config.setEmptyDefaultFeed(feed === EMPTY_FEED);
  defaultFeed = feed;  
}

// Mark default as empty 
config.setEmptyDefaultFeed(true);

if (config.isPublicServer()) {
  const feed = DEFAULT_FEED;
  feed.categories.forEach(c => {
    if (c.background) {
      c.background = getImage(c.background);
    }
    if (c.thumbnail) {
      c.thumbnail = getImage(c.thumbnail);
    }
    c.items.forEach(i => {
      if (i.background) {
        i.background = getImage(i.background);
      }
      if (i.thumbnail) {
        i.thumbnail = getImage(i.thumbnail);
      }
      const props = i.props;
      if (props.rom) {
        props.rom = getRom(props.rom);
      }
    })
  });
  setDefaultFeed(feed);
}

export { getDefaultFeed, setDefaultFeed }   
