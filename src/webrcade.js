import React, { Component } from "react";
import Slider from "./components/slider";
import AppDetails from "./components/app-details";
import AppCategory from "./components/app-category";
import ImageButton from "./components/image-button";
import Logo from "./components/logo";
import Loading from "./components/loading";
import { GamepadNotifier, FocusGrid } from "./input"
import { AppRegistry } from './apps';
import { WebrcadeFeed, getDefaultFeed } from './feed';
import { isDev, UrlUtil, FetchAppData } from '@webrcade/app-common'

import PlayImageWhite from "./images/play-white.svg"
import PlayImageBlack from "./images/play-black.svg"

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    this.state = {
      category: null,
      currentItem: null,
      feed: null,
      mode: this.ModeEnum.LOADING,
      menuMode: this.MenuModeEnum.CATEGORIES,      
      loadingStatus: "Loading...",
      initialFeed: true,
    };

    const feedInfo = this.parseFeed(getDefaultFeed());
    this.state = {...this.state, ...feedInfo}

    this.sliderRef = React.createRef();
    this.playButtonRef = React.createRef();
    this.categoryRef = React.createRef();
    this.appRef = React.createRef();

    this.focusGrid.setComponents([
      [this.playButtonRef],
      [this.categoryRef],
      [this.sliderRef]
    ]);
  }

  MIN_LOADING_TIME = 1500;
  MAX_SLIDES = 8;
  HASH_PLAY = "play";
  RP_FEED = "feed";

  ModeEnum = {
    LOADING: "loading",
    MENU: "menu",
    APP: "app"
  }

  MenuModeEnum = {
    APPS: "apps",
    CATEGORIES: "categories"
  }  

  focusGrid = new FocusGrid();

  gamepadCallback = e => {
    const { focusGrid } = this;
    focusGrid.focus();
    return true;
  }

  popstateHandler = e => {
    const { ModeEnum, appRef } = this;
    const { mode } = this.state;

    // Returning to menu
    if (mode === ModeEnum.APP) {
      if (appRef.current) {
        try {
          const content = appRef.current.contentWindow;
          if (content) {
            content.postMessage("exit", "*");            
          }
        } catch (e) {
          // TODO: Proper error handling
          console.error(e);
        }
      }      
    }
  }

  messageListener = e => {
    const { ModeEnum } = this;
    if (e.data === 'exitComplete') {
      this.setState({ mode: ModeEnum.MENU });
    }
  }

  parseFeed(feedContent) {
    const { MenuModeEnum } = this;
    const feed = new WebrcadeFeed(feedContent, (3 * this.MAX_SLIDES + 2));
    if (feed) {
      const category = feed.getCategories()[0];
      const isCategories = feed.getUniqueCategoryCount() > 1;
      return {
        feed: feed,
        category: category,
        currentItem: isCategories ? category : category.items[0],
        menuMode: isCategories ? MenuModeEnum.CATEGORIES : MenuModeEnum.APPS
      }
    }
    return null;
  }

  componentDidMount() {
    const { ModeEnum } = this;
    const { mode } = this.state;

    window.addEventListener('popstate', this.popstateHandler, false);
    window.addEventListener("message", this.messageListener);

    // Clear hash if displaying menu
    const hash = window.location.href.indexOf('#');
    if (mode !== ModeEnum.APP && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }      

    // Start the gamepad notifier 
    GamepadNotifier.instance.start();
    GamepadNotifier.instance.setDefaultCallback(this.gamepadCallback);

    this.setState({ initial: true });
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstateHandler);
    window.removeEventListener("message", this.messageListener);

    // Stop the gamepad notifier
    GamepadNotifier.instance.stop();
    GamepadNotifier.instance.setDefaultCallback(null);    
  }

  componentDidUpdate(prevProps, prevState) {
    const { mode, initial, initialFeed } = this.state;
    const { ModeEnum, sliderRef, MIN_LOADING_TIME } = this;    

    const start = Date.now();
    if (mode === ModeEnum.LOADING) {
      if (initialFeed) {
        const url = window.location.search;
        const feed = UrlUtil.getParam(url, this.RP_FEED);      
        if (feed) {
          console.log('feed: ' + feed);
          
          const minWait = start + MIN_LOADING_TIME;   

          this.setState({
            loadingStatus: "Loading feed...",
            initialFeed: false
          });
          
          new FetchAppData(feed).fetch()
            .then(response => response.json())
            .then(json => this.parseFeed(json))
            .then(feedInfo => this.setState(feedInfo))
            .catch(msg => console.log('Error reading feed: ' + msg)) // TODO: Proper logging
            .finally(() => {
              let wait = minWait - Date.now();
              wait = wait > 0 ? wait : 0;
              setTimeout(() => this.setState({mode: ModeEnum.MENU}), wait);
            })
        } else {      
          setTimeout(() => this.setState({mode: ModeEnum.MENU}), 
            MIN_LOADING_TIME);
        }
      }
    } else if (initial ||
      (prevState.mode === ModeEnum.APP && mode === ModeEnum.MENU)) {
      this.setState({
        initial: false
      });
      setTimeout(() => {
        window.focus();
        sliderRef.current.focus();
      }, 0);
    }
  }

  getCategoryTitle(item) {
    return item.longTitle ? item.longTitle : item.title;
  }

  renderMenu() {
    const { category, currentItem, mode, menuMode, feed } = this.state;
    const { focusGrid, playButtonRef, sliderRef, categoryRef, ModeEnum,
      MenuModeEnum, HASH_PLAY, MAX_SLIDES } = this;
    const reg = AppRegistry.instance;

    const isCategories = (menuMode === MenuModeEnum.CATEGORIES);
    const items = isCategories ? feed.getCategories() : category.items;

    let title = '', backgroundSrc = null, description = null, subTitle = null,
      categoryLabel = null, getTitle = null, getThumbnailSrc, onClick = null;

    if (currentItem) {
      if (isCategories) {
        title = this.getCategoryTitle(currentItem);
        backgroundSrc = currentItem.background; /* TODO: Default */
        description = currentItem.description;
        categoryLabel = "Categories";
        getTitle = item => item.title;
        getThumbnailSrc = item => item.thumbnail ? item.thumbnail : 'images/apps/folder.png';
        onClick = () => {
          this.setState({
            menuMode: MenuModeEnum.APPS,
            category: currentItem,
            currentItem: currentItem.items[0],
          });
          sliderRef.current.focus();
        }
      } else {
        title = reg.getLongTitle(currentItem);
        backgroundSrc = reg.getBackground(currentItem);
        description = reg.getDescription(currentItem);
        subTitle = reg.getName(currentItem);
        categoryLabel = this.getCategoryTitle(category);
        getTitle = item => reg.getTitle(item);
        getThumbnailSrc = item => reg.getThumbnail(item);
        onClick = () => {
          window.location.hash = HASH_PLAY;
          this.setState({ mode: ModeEnum.APP })
        };
      }
    }

    return (
      <div className="webrcade">
        <div className={'webrcade-outer' +          
          (mode !== ModeEnum.MENU ? ' webrcade-outer--hide' : '')}>
          <Logo/>
          <AppDetails
            title={title}
            description={description}
            subTitle={subTitle}
            backgroundSrc={backgroundSrc}
            buttons={currentItem ?
              <ImageButton
                onPad={e => focusGrid.moveFocus(e.type, playButtonRef)}
                onClick={onClick}
                ref={playButtonRef}
                imgSrc={!isCategories ? PlayImageBlack : null}
                hoverImgSrc={!isCategories ? PlayImageWhite : null}
                label={isCategories ? "SELECT" : "PLAY"}
              /> : null
            }
            bottom={
              <AppCategory
                isSelectable={!isCategories && feed.getUniqueCategoryCount() > 1}
                onPad={e => focusGrid.moveFocus(e.type, categoryRef)}
                ref={categoryRef}
                label={categoryLabel}
                onClick={() => {
                  this.setState({ menuMode: MenuModeEnum.CATEGORIES });
                  sliderRef.current.focus();
                }}
              />
            }
          />
          <Slider
            maxSlides={MAX_SLIDES}
            onPad={e => focusGrid.moveFocus(e.type, sliderRef)}
            items={items}
            ref={sliderRef}
            getTitle={getTitle}
            getThumbnailSrc={getThumbnailSrc}
            onSelected={item => this.setState({ currentItem: item })}
            onClick={() => playButtonRef.current.focus()} />
        </div>
      </div>
    );
  }

  renderApp() {
    const { appRef } = this;
    const { currentItem } = this.state;
    const reg = AppRegistry.instance;

    
    return (      
      <div className="webrcade-app">        
        {
          // eslint-disable-next-line
        }<iframe
          ref={appRef}
          style={!isDev() ? { display: "none" } : {}}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; gamepad"
          // title={reg.getTitle(currentItem)}
          src={reg.getLocation(currentItem)} />
      </div>
    )
  }

  renderLoading() {
    const { loadingStatus } = this.state;

    return (
      <div>
        <Loading text={loadingStatus}/>
      </div>
    );
  }

  render() {
    const { mode } = this.state;
    const { ModeEnum } = this;

    return (
      <>
        {mode === ModeEnum.LOADING ? this.renderLoading() : this.renderMenu()}
        {mode === ModeEnum.APP ? this.renderApp() : null}
      </>
    );
  }
}

export default Webrcade;
