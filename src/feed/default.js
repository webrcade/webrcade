import DEFAULT_FEED from './default-feed.json'
import { config, isDev } from '@webrcade/app-common'

const getDefaultFeed = () => {
  const feed = JSON.parse(JSON.stringify(DEFAULT_FEED));
  feed.categories.forEach(c => {
    c.items.forEach(i => {
      const props = i.props;
      if (props.rom) {
        props.rom = (isDev() ? "http://" + config.getLocalIp() + ":3000/" : "../../") + props.rom;
      }
    })
  });

  return feed;
};

export { getDefaultFeed }
