import React, { Component } from "react";
import { 
  toggleTabIndex,  
  FocusGrid, 
  GamepadNotifier,
  ImageButton,   
  Message,  
  Resources,
  WebrcadeContext,
  LOG,
  TEXT_IDS,  
  AddCircleBlackImage,
  AddCircleWhiteImage,
  CloudDownloadBlackImage,
  CloudDownloadWhiteImage,
  DeleteForeverBlackImage,
  DeleteForeverWhiteImage,
  PlayArrowBlackImage,
  PlayArrowWhiteImage
} from '@webrcade/app-common'

import AppCategory from "./app-category";
import AppDetails from "./app-details";
import { AppRegistry } from '../../../apps';
import { Feeds } from "../../../feed";
import Logo from "../../components/logo";
import Slider from "../../components/slider";

require("./style.scss");

export default class AppBrowseScreen extends Component {

  constructor() {
    super();

    this.state = {
      category: null,
      currentItem: null,
      menuMode: AppBrowseScreen.ModeEnum.CATEGORIES,
      browseScreen: this
    };

    this.sliderRef = React.createRef();
    this.playButtonRef = React.createRef();
    this.deleteButtonRef = React.createRef();
    this.categoryRef = React.createRef();
    this.appRef = React.createRef();
    this.webrcadeDivRef = React.createRef();

    this.focusGrid.setComponents([
      [this.playButtonRef, this.deleteButtonRef],
      [this.categoryRef],
      [this.sliderRef]
    ]);
  }

  static ModeEnum = {
    FEEDS: "feeds",
    APPS: "apps",
    CATEGORIES: "categories"
  }

  MAX_SLIDES = 8;

  focusGrid = new FocusGrid();
  gamepadNotifier = new GamepadNotifier();  
  screenContext = {gamepadNotifier: this.gamepadNotifier};

  gamepadCallback = e => {
    const { focusGrid } = this;

    focusGrid.focus();
    return true;
  }

  focus() {
    const { sliderRef } = this;
    sliderRef.current.focus();
  }

  startGamepadNotifier() {
    const { gamepadNotifier } = this;
    gamepadNotifier.start();
    gamepadNotifier.setDefaultCallback(this.gamepadCallback);
  }

  stopGamepadNotifier() {
    const { gamepadNotifier } = this;
    gamepadNotifier.stop();
    gamepadNotifier.setDefaultCallback(null);
  }

  onResize = () => {
    this.webrcadeDivRef.current.style.height = window.innerHeight + "px";
  }

  componentDidMount() {
    this.startGamepadNotifier();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
  }

  componentWillUnmount() {
    this.stopGamepadNotifier();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { hide, disable } = this.props;
    const { sliderRef, webrcadeDivRef } = this;

    if (hide || disable) {
      this.stopGamepadNotifier();      
      if (disable && !prevProps.disable) {
        toggleTabIndex(webrcadeDivRef.current, false);
      }
    } else {
      this.startGamepadNotifier();
      if (!disable && prevProps.disable) {
        toggleTabIndex(webrcadeDivRef.current, true);
      }
      if (sliderRef && sliderRef.current) {
        sliderRef.current.focus();
      }
    }
  }  

  static getDerivedStateFromProps(props, state) {
    const { ModeEnum } = AppBrowseScreen;

    if (!state || props.feed !== state.feed) {

      LOG.info('feed has changed');

      const feed = props.feed;
      if (feed) {
        const category = feed.getCategories()[0];
        const isCategories = feed.getUniqueCategoryCount() > 1;        
        if (state && state.browseScreen) {
          setTimeout(() => {
            state.browseScreen.sliderRef.current.focus();
          }, 0);
        }
        return {
          feed: feed,
          category: category,
          currentItem: isCategories ? category : category.items[0],
          menuMode: isCategories ? ModeEnum.CATEGORIES : ModeEnum.APPS
        }
      }
    }
    return null;
  }

  getLongTitle(item) {
    return item.longTitle ? item.longTitle : item.title;
  }

  getFeedInfo(currentItem) {
    const { onFeedLoad } = this.props;
    const isAdd = currentItem.feedId === Feeds.ADD_ID;

    const defaultThumbnail = 'images/feed.png';

    return {
      title: this.getLongTitle(currentItem),
      subTitle: Feeds.getUrl(currentItem),      
      description: currentItem.description,
      backgroundSrc: currentItem.background ? currentItem.background : 'images/feed-background.png',
      defaultBackgroundSrc: 'images/feed-background.png',        
      categoryLabel: Resources.getText(TEXT_IDS.FEEDS),            
      playLabel: Resources.getText(isAdd ? TEXT_IDS.ADD_UC : TEXT_IDS.LOAD_UC),
      playImg: isAdd ? AddCircleBlackImage : CloudDownloadBlackImage,
      playHoverImg: isAdd ? AddCircleWhiteImage : CloudDownloadWhiteImage,      
      isDeleteEnabled: Feeds.isDeleteEnabled(currentItem),
      getTitle: item => item.title,
      getThumbnailSrc: item => item.thumbnail ? item.thumbnail : defaultThumbnail,      
      getDefaultThumbnailSrc: () => defaultThumbnail,
      onClick: () => onFeedLoad(currentItem),    
    }
  }

  getCategoryInfo(currentItem) {
    const { sliderRef } = this;
    const { ModeEnum } = AppBrowseScreen;

    const defaultThumbnail = 'images/folder.png';

    return {
      title: this.getLongTitle(currentItem),
      description: currentItem.description,
      backgroundSrc: currentItem.background ? currentItem.background : 'images/folder-background.png' , 
      defaultBackgroundSrc: 'images/folder-background.png',        
      categoryLabel: Resources.getText(TEXT_IDS.CATEGORIES),
      playLabel: Resources.getText(TEXT_IDS.SELECT_UC),
      flyoutLabel: Resources.getText(TEXT_IDS.SHOW_FEEDS),
      getTitle: item => item.title,
      getThumbnailSrc: item => item.thumbnail ? item.thumbnail : defaultThumbnail,
      getDefaultThumbnailSrc: () => defaultThumbnail,
      onClick: () => {
        this.setState({
          menuMode: ModeEnum.APPS,
          category: currentItem,
          currentItem: currentItem.items[0],
        });
        sliderRef.current.focus();
      },
      categoryOnClick: () => {
        this.setState({
          currentItem: this.props.feeds[0],
          menuMode: AppBrowseScreen.ModeEnum.FEEDS
        });
        sliderRef.current.focus();
      }
    }
  }

  getAppInfo(currentItem) {
    const { sliderRef } = this;
    const { onAppSelected } = this.props;
    const { category } = this.state;
    const { ModeEnum } = AppBrowseScreen;
    const reg = AppRegistry.instance;

    return {
      title: reg.getLongTitle(currentItem),
      subTitle: reg.getName(currentItem),      
      description: reg.getDescription(currentItem),
      backgroundSrc: reg.getBackground(currentItem),   
      defaultBackgroundSrc: reg.getDefaultBackground(currentItem),   
      categoryLabel: this.getLongTitle(category),
      flyoutLabel: Resources.getText(TEXT_IDS.SHOW_CATEGORIES),
      playLabel: Resources.getText(TEXT_IDS.PLAY_UC),
      playImg: PlayArrowBlackImage,
      playHoverImg: PlayArrowWhiteImage,      
      getTitle: item => reg.getTitle(item),
      getThumbnailSrc: item => reg.getThumbnail(item),
      getDefaultThumbnailSrc: item => reg.getDefaultThumbnail(item),
      onClick: () => { if (onAppSelected) onAppSelected(currentItem); },
      categoryOnClick: () => {
        this.setState({ menuMode: ModeEnum.CATEGORIES });
        sliderRef.current.focus();
      }
    }
  }

  render() {
    const { feeds, hide, onFeedDelete } = this.props;
    const { category, currentItem, feed, menuMode } = this.state;
    const {  categoryRef, focusGrid, playButtonRef, screenContext, sliderRef, 
      webrcadeDivRef, MAX_SLIDES } = this;
    const { ModeEnum } = AppBrowseScreen;

    const isCategories = (menuMode === ModeEnum.CATEGORIES);
    const isFeeds = (menuMode === ModeEnum.FEEDS);
    const items = isFeeds ?
      feeds : isCategories ? feed.getCategories() : category.items;

    let itemId = 0, info = null;

    if (currentItem) {
      itemId = currentItem.id;      
      info = isFeeds ? this.getFeedInfo(currentItem, itemId) :
        isCategories ? this.getCategoryInfo(currentItem) : this.getAppInfo(currentItem);
    }

    return (
      <WebrcadeContext.Provider value={screenContext}>
        <div ref={webrcadeDivRef} style={{height: window.innerHeight + "px"}} className="webrcade">          
          <div className={'webrcade-outer' +
            (hide === true ? ' webrcade-outer--hide' : '')}>
            <Logo />
            <Message />
            <AppDetails
              itemKey={(isFeeds ? "feed" : isCategories ? 'cat' : 'item') + ":" + itemId}
              title={info.title}
              description={info.description}
              subTitle={info.subTitle}
              backgroundSrc={info.backgroundSrc}
              defaultBackgroundSrc={info.defaultBackgroundSrc}
              buttons={currentItem ?
                <>
                  <ImageButton
                    onPad={e => focusGrid.moveFocus(e.type, playButtonRef)}
                    onClick={info.onClick}
                    ref={playButtonRef}
                    imgSrc={info.playImg}
                    hoverImgSrc={info.playHoverImg}
                    label={info.playLabel}
                  /> 
                  {info.isDeleteEnabled ?                 
                    <ImageButton
                      onPad={e => focusGrid.moveFocus(e.type, this.deleteButtonRef)}
                      onClick={() => onFeedDelete(currentItem)}
                      ref={this.deleteButtonRef}
                      imgSrc={DeleteForeverBlackImage}
                      hoverImgSrc={DeleteForeverWhiteImage}
                      label={Resources.getText(TEXT_IDS.DELETE_UC)}
                    /> 
                  : null}
                </> : null
              }
              bottom={
                <AppCategory
                  isSelectable={info.flyoutLabel}                  
                  onPad={e => focusGrid.moveFocus(e.type, categoryRef)}
                  ref={categoryRef}
                  label={info.categoryLabel}
                  flyoutLabel={info.flyoutLabel}
                  onClick={info.categoryOnClick}
                />
              }
            />
            <Slider
              maxSlides={MAX_SLIDES}
              onPad={e => focusGrid.moveFocus(e.type, sliderRef)}
              items={items}
              ref={sliderRef}
              getTitle={info.getTitle}
              getThumbnailSrc={info.getThumbnailSrc}
              getDefaultThumbnailSrc={info.getDefaultThumbnailSrc}
              onSelected={item => this.setState({ currentItem: item })}
              onClick={() => playButtonRef.current.focus()} />
          </div>
        </div>
      </WebrcadeContext.Provider>
    );
  }
};
