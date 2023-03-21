import { 
  AppRegistry,
  // GamepadEnum,
  Resources,
  TEXT_IDS,  
  PlayArrowBlackImage,
  PlayArrowWhiteImage
} from '@webrcade/app-common'

import * as Session from "./session"

const getAppInfo = (appBrowse, currentItem) => {
  const { sliderRef } = appBrowse;
  const { onAppSelected, feed } = appBrowse.props;
  const { category } = appBrowse.state;
  const { ModeEnum } = appBrowse;
  const reg = AppRegistry.instance;

  return {
    title: reg.getLongTitle(currentItem),
    subTitle: reg.getName(currentItem),      
    description: reg.getDescription(currentItem),
    backgroundSrc: reg.getBackground(currentItem),   
    backgroundPixelated: currentItem.backgroundPixelated,
    defaultBackgroundSrc: reg.getDefaultBackground(currentItem),   
    categoryLabel: appBrowse.getLongTitle(category),
    flyoutLabel: Resources.getText(TEXT_IDS.SHOW_CATEGORIES),
    button1Label: Resources.getText(TEXT_IDS.PLAY_UC),
    button1Img: PlayArrowBlackImage,
    button1HoverImg: PlayArrowWhiteImage,      
    getTitle: item => reg.getTitle(item),
    getThumbnailSrc: item => reg.getThumbnail(item),
    getDefaultThumbnailSrc: item => reg.getDefaultThumbnail(item),
    onClick: () => { 
      if (onAppSelected) onAppSelected(currentItem); 
      Session.setLastItem(feed.getTitle(), category.title, currentItem.title);
    },
    categoryOnClick: () => {
      appBrowse.setState({ 
        currentItem: feed.getCategories()[0],
        menuMode: ModeEnum.CATEGORIES 
      }, () => { setTimeout(() => { Session.clearLastItem(); }, 0)});
      sliderRef.current.focus();
    }
  }
}

export default getAppInfo; 