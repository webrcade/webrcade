import DEFAULT_FEED from './default-feed.json'
import { isDev } from '@webrcade/app-common'

const getDefaultFeed = () => { 
  const feed = JSON.parse(JSON.stringify(DEFAULT_FEED));
  if (isDev) {
    feed.categories.forEach(c => {
      c.items.forEach(i => {
        const props = i.props;
        if (props.rom) {
          props.rom = "http://192.168.1.179:3000/" + props.rom;
        }
      });
    }); 
  }

  return feed;
};

export { getDefaultFeed }
