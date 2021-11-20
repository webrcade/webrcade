import React, { Component } from "react";
import { 
  hideMessage,
  toggleTabIndex,  
  FocusGrid, 
  GamepadNotifier,
  ImageButton,   
  Message,  
  WebrcadeContext,
  LOG,
} from '@webrcade/app-common'

import * as Xbox from '../../../util/xbox';
import getAppInfo from "./app";
import getCategoryInfo from "./category";
import getFeedInfo from "./feed";
import AppCategory from "./app-category";
import AppDetails from "./app-details";
import Logo from "../../components/logo";
import Slider from "../../components/slider";

require("./style.scss");

export default class AppBrowseScreen extends Component {

  constructor() {
    super();
    
    this.ModeEnum = AppBrowseScreen.ModeEnum;

    this.state = {
      category: null,
      currentItem: null,
      menuMode: this.ModeEnum.CATEGORIES,
      browseScreen: this
    };

    this.sliderRef = React.createRef();
    this.button1Ref = React.createRef();
    this.button2Ref = React.createRef();
    this.categoryRef = React.createRef();
    this.appRef = React.createRef();
    this.webrcadeDivRef = React.createRef();    
    this.browsingModeListener = null;

    this.focusGrid.setComponents([
      [this.button1Ref, this.button2Ref],
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
    const { context } = this.props;
    const { gamepadNotifier } = this;
    
    if (!this.browsingModeListener) {
      // This attempts to detect the Xbox browser's "Browsing Mode"
      this.browsingModeListener = new Xbox.BrowsingModeListener(
        gamepadNotifier, () => { context.showXboxBrowsingAlert(); }          
      );
    }

    this.startGamepadNotifier();
    this.browsingModeListener.registerListeners();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);    
  }

  componentWillUnmount() {
    this.stopGamepadNotifier();
    this.browsingModeListener.unregisterListeners();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { hide, disable } = this.props;
    const { sliderRef, webrcadeDivRef } = this;

    if (hide || disable) {
      this.stopGamepadNotifier();      
      this.browsingModeListener.unregisterListeners();

      if (disable && !prevProps.disable) {
        toggleTabIndex(webrcadeDivRef.current, false);
      }
    } else {
      this.startGamepadNotifier();
      this.browsingModeListener.registerListeners();

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

  render() {
    const { feeds, hide } = this.props;
    const { category, currentItem, feed, menuMode } = this.state;
    const { categoryRef, focusGrid, button1Ref, screenContext, sliderRef, 
      webrcadeDivRef, MAX_SLIDES } = this;
    const { ModeEnum } = this;

    const isCategories = (menuMode === ModeEnum.CATEGORIES);
    const isFeeds = (menuMode === ModeEnum.FEEDS);
    const items = isFeeds ?
      feeds : isCategories ? feed.getCategories() : category.items;

    let itemId = 0, info = null;

    if (currentItem) {
      itemId = currentItem.id;      
      info = isFeeds ? getFeedInfo(this, currentItem, itemId) :
        isCategories ? getCategoryInfo(this, currentItem) : 
          getAppInfo(this, currentItem);
    }

    return (
      <WebrcadeContext.Provider value={screenContext}>      
        <div ref={webrcadeDivRef} style={{height: window.innerHeight + "px"}} className="webrcade">                  
          <div className={'webrcade-outer' +
            (hide === true ? ' webrcade-outer--hide' : '')}>
            <Message />
            <Logo />            
            <AppDetails
              //itemKey={(isFeeds ? "feed" : isCategories ? 'cat' : 'item') + ":" + itemId}
              itemKey={itemId}
              title={info.title}
              description={info.description}
              subTitle={info.subTitle}
              backgroundSrc={info.backgroundSrc}
              defaultBackgroundSrc={info.defaultBackgroundSrc}
              buttons={currentItem ?
                <>
                  <ImageButton
                    onPad={e => focusGrid.moveFocus(e.type, button1Ref)}
                    onClick={info.onClick}
                    ref={button1Ref}
                    imgSrc={info.button1Img}
                    hoverImgSrc={info.button1HoverImg}
                    label={info.button1Label}
                  /> 
                  {info.isButton2Enabled ?                 
                    <ImageButton
                      onPad={e => focusGrid.moveFocus(e.type, this.button2Ref)}
                      onClick={info.button2OnClick}
                      ref={this.button2Ref}
                      imgSrc={info.button2Img}
                      hoverImgSrc={info.button2HoverImg}
                      label={info.button2Label}
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
              onClick={() => button1Ref.current.focus()} />
          </div>
        </div>
      </WebrcadeContext.Provider>
    );
  }
};

