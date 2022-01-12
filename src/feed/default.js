import DEFAULT_FEED from './default-feed.json'
// import { config, isDev } from '@webrcade/app-common'

const RAW_PREFIX = "https://raw.githubusercontent.com/webrcade/webrcade/master/public/";

const getImage = (url) => {
  // TODO: Add this back, right now prior to release forcing close to production test scenario
  // return (isDev() ? "http://" + config.getLocalIp() + ":3000/" : RAW_PREFIX) + url;
  return url;
}
const getRom = (url) => {
  return RAW_PREFIX + url;
}

const getDefaultFeed = () => {
  const feed = JSON.parse(JSON.stringify(DEFAULT_FEED));
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
        //props.rom = (isDev() ? "http://" + config.getLocalIp() + ":3000/" : "../../") + props.rom;
        props.rom = getRom(props.rom);
      }
    })
  });

  return feed;
};

export { getDefaultFeed }
