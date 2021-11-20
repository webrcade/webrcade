import { 
  Feeds,
  Resources,
  TEXT_IDS,  
  AddCircleBlackImage,
  AddCircleWhiteImage,
  CloudDownloadBlackImage,
  CloudDownloadWhiteImage,
  DeleteForeverBlackImage,
  DeleteForeverWhiteImage,
} from '@webrcade/app-common'

const getFeedInfo = (appBrowse, currentItem) => {
  const { onFeedLoad, onFeedDelete } = appBrowse.props;
  const isAdd = currentItem.feedId === Feeds.ADD_ID;

  const defaultThumbnail = 'images/feed.png';

  return {
    title: appBrowse.getLongTitle(currentItem),
    subTitle: Feeds.getUrl(currentItem),      
    description: currentItem.description,
    backgroundSrc: currentItem.background ? currentItem.background : 'images/feed-background.png',
    defaultBackgroundSrc: 'images/feed-background.png',        
    categoryLabel: Resources.getText(TEXT_IDS.FEEDS),            
    button1Label: Resources.getText(isAdd ? TEXT_IDS.ADD_UC : TEXT_IDS.LOAD_UC),
    button1Img: isAdd ? AddCircleBlackImage : CloudDownloadBlackImage,
    button1HoverImg: isAdd ? AddCircleWhiteImage : CloudDownloadWhiteImage,      
    isButton2Enabled: Feeds.isDeleteEnabled(currentItem),
    button2Label: Resources.getText(TEXT_IDS.DELETE_UC),
    button2Img: DeleteForeverBlackImage,
    button2HoverImg: DeleteForeverWhiteImage,      
    getTitle: item => item.title,
    getThumbnailSrc: item => item.thumbnail ? item.thumbnail : defaultThumbnail,      
    getDefaultThumbnailSrc: () => defaultThumbnail,
    onClick: () => onFeedLoad(currentItem),    
    button2OnClick: () => onFeedDelete(currentItem),
  }
}

export default getFeedInfo; 