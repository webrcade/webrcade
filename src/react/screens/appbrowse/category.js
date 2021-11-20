import { 
  Resources,
  TEXT_IDS,  
} from '@webrcade/app-common'

const getCategoryInfo = (appBrowse, currentItem) => {
  const { sliderRef } = appBrowse;
  const { ModeEnum } = appBrowse;

  const defaultThumbnail = 'images/folder.png';

  return {
    title: appBrowse.getLongTitle(currentItem),
    description: currentItem.description,
    backgroundSrc: currentItem.background ? currentItem.background : 'images/folder-background.png' , 
    defaultBackgroundSrc: 'images/folder-background.png',        
    categoryLabel: Resources.getText(TEXT_IDS.CATEGORIES),
    button1Label: Resources.getText(TEXT_IDS.SELECT_UC),
    flyoutLabel: Resources.getText(TEXT_IDS.SHOW_FEEDS),
    getTitle: item => item.title,
    getThumbnailSrc: item => item.thumbnail ? item.thumbnail : defaultThumbnail,
    getDefaultThumbnailSrc: () => defaultThumbnail,
    onClick: () => {
      appBrowse.setState({
        menuMode: ModeEnum.APPS,
        category: currentItem,
        currentItem: currentItem.items[0],
      });
      sliderRef.current.focus();
    },
    categoryOnClick: () => {
      appBrowse.setState({
        currentItem: appBrowse.props.feeds[0],
        menuMode: ModeEnum.FEEDS
      });
      sliderRef.current.focus();
    }
  }
}

export default getCategoryInfo; 