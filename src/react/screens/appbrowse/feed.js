import { 
  Feeds,
  Resources,
  TEXT_IDS,  
  CloudBlackImage,
  CloudWhiteImage,  
  CloudDownloadBlackImage,
  CloudDownloadWhiteImage,
  DescriptionBlackImage,
  DescriptionWhiteImage,
  DeleteForeverBlackImage,
  DeleteForeverWhiteImage,
} from '@webrcade/app-common'

import { addLocalFeed } from '../../feeds';

const getFeedInfo = (appBrowse, currentItem) => {
  const { onFeedLoad, onFeedDelete } = appBrowse.props;
  const isAdd = currentItem.feedId === Feeds.ADD_ID;

  const defaultThumbnail = 'images/feed.png';

  return {
    title: appBrowse.getLongTitle(currentItem),
    subTitle: currentItem.localId ? Resources.getText(TEXT_IDS.LOCAL_PARENS)  : Feeds.getUrl(currentItem),      
    description: currentItem.description,
    backgroundSrc: currentItem.background ? currentItem.background : 'images/feed-background.png',
    defaultBackgroundSrc: 'images/feed-background.png',        
    categoryLabel: Resources.getText(TEXT_IDS.FEEDS),            
    button1Label: Resources.getText(isAdd ? TEXT_IDS.URL : TEXT_IDS.LOAD_UC),
    button1Img: isAdd ? CloudBlackImage : CloudDownloadBlackImage,
    button1HoverImg: isAdd ? CloudWhiteImage : CloudDownloadWhiteImage,      
    isButton2Enabled: Feeds.isDeleteEnabled(currentItem) || isAdd,
    button2Label: Resources.getText(isAdd ? TEXT_IDS.FILE_UC : TEXT_IDS.DELETE_UC),
    button2Img: isAdd ? DescriptionBlackImage : DeleteForeverBlackImage,
    button2HoverImg: isAdd ? DescriptionWhiteImage : DeleteForeverWhiteImage,      
    getTitle: item => item.title,
    getThumbnailSrc: item => item.thumbnail ? item.thumbnail : defaultThumbnail,      
    getDefaultThumbnailSrc: () => defaultThumbnail,
    onClick: () => onFeedLoad(currentItem),    
    button2OnClick: isAdd ? null : () => onFeedDelete(currentItem),
    button2OnFile: (isAdd ? (e) => { 
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        addLocalFeed(file);
      }
    } : null)
  }
}

export default getFeedInfo; 
