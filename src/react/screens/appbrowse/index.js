import React, { Component } from "react";
import {
  iosClose,
  isIos,
  settings,
  toggleTabIndex,
  FocusGrid,
  GamepadNotifier,
  FileButton,
  ImageButton,
  Message,
  SearchWhiteImage,
  SettingsWhiteImage,
  WebrcadeContext,
  LOG,
  uuidv4,
} from '@webrcade/app-common'

import * as Session from "./session"

import * as Xbox from '../../../util/xbox';
import getAppInfo from "./app";
import getCategoryInfo from "./category";
import getFeedInfo from "./feed";
import AppCategory from "./app-category";
import AppDetails from "./app-details";
import Logo from "../../components/logo";
import Slider from "../../components/slider";
import getSearchItemInfo, { getSearchItems } from './searchresult';

require("./style.scss");

export default class AppBrowseScreen extends Component {

  constructor() {
    super();

    this.ModeEnum = AppBrowseScreen.ModeEnum;

    this.state = {
      category: null,
      currentItem: null,
      menuMode: this.ModeEnum.CATEGORIES,
      browseScreen: this,
      iosFix: !isIos(), // false,
      display: !isIos(), //false
      searchTerm: ''
    };

    this.sliderRef = React.createRef();
    this.button1Ref = React.createRef();
    this.button2Ref = React.createRef();
    this.settingsRef = React.createRef();
    this.searchRef = React.createRef();
    this.settingsDetailsRef = React.createRef();
    this.searchDetailsRef = React.createRef();
    this.categoryRef = React.createRef();
    this.appRef = React.createRef();
    this.webrcadeDivRef = React.createRef();
    this.browsingModeListener = null;

    this.focusGrid.setComponents([
      [this.searchRef, this.settingsRef],
      [this.searchDetailsRef, this.settingsDetailsRef],
      [this.button1Ref, this.button2Ref],
      [this.categoryRef],
      [this.sliderRef]
    ]);
    this.focusGrid.setDefaultComponent(this.sliderRef);
  }

  static ModeEnum = {
    FEEDS: "feeds",
    APPS: "apps",
    CATEGORIES: "categories"
  }

  static cssElements = [];

  MAX_SLIDES = 8;
  _searchDebounceTimer = null;
  _searchCache = null;
  _searchCountCache = null;

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

  clearSearch() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
    const { feed, menuMode, category } = this.state;
    const { ModeEnum } = this;
    let currentItem;
    if (menuMode === ModeEnum.CATEGORIES) {
      currentItem = feed ? feed.getCategories()[0] : null;
    } else if (menuMode === ModeEnum.APPS) {
      currentItem = category ? category.items[0] : null;
    } else {
      currentItem = this.state.currentItem;
    }
    this.setState({ searchTerm: '', currentItem });
  }

  onSearchChange = (term) => {
    if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
    this._searchDebounceTimer = setTimeout(() => {
      this._searchDebounceTimer = null;
      const trimmed = term.trim();
      if (trimmed !== '' && this.getSearchItems(trimmed).filter(i => !i.duplicate).length > 0) {
        this.setState({ searchTerm: trimmed });
      } else {
        this.clearSearch();
      }
    }, 300);
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
    if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
    this.stopGamepadNotifier();
    this.browsingModeListener.unregisterListeners();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { hide, disable } = this.props;
    const { iosFix } = this.state;
    const { sliderRef, webrcadeDivRef } = this;

    if (!iosFix && !hide) {
      this.setState({iosFix: true})
      setTimeout(() => {
        let metaTag = document.querySelector('meta[name="viewport"]');
        if (metaTag) {
          // Change the content of the existing meta tag
          metaTag.setAttribute('content', `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover`);
          setTimeout(() => {
            metaTag.setAttribute('content', `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=auto`);
            setTimeout(() => {
              this.setState({display: true})
            }, 50);
          }, 300);
        } else {
          this.setState({display: true})
        }
      }, 0);
    }

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
    const { cssElements, ModeEnum } = AppBrowseScreen;

    if (!state || props.feed !== state.feed) {

      LOG.info('feed has changed');

      const head = document.head;

      // clear CSS
      console.log(cssElements)
      for (let i = 0; i < cssElements.length; i++) {
        const id = cssElements[i];
        const el = document.getElementById(id);
        console.log(el);
        if (el) {
          head.removeChild(el);
        }
      }
      while(cssElements.length > 0) {
        cssElements.pop();
      }

      const feed = props.feed;
      if (feed) {
        // CSS
        const feedProps = feed.getProps()
        if (feedProps.css && Array.isArray(feedProps.css)) {
          const cssUrls = feedProps.css;
          for (let i = 0; i < cssUrls.length; i++) {
            const el = document.createElement('link');
            const id = uuidv4();
            el.setAttribute('id', id);
            el.setAttribute('rel', 'stylesheet');
            el.setAttribute('type', 'text/css');
            el.setAttribute('href', cssUrls[i]);
            cssElements.push(id);
            head.appendChild(el);
          }
        }

        // Determine category and item for new feed (based on session state)
        let category = null;
        let item = null;
        if (feed.getTitle() === Session.getLastFeedTitle()) {
          category = feed.findCategoryByTitle(Session.getLastCategoryTitle());
        }
        if (!category) {
          category = feed.getCategories()[0];
        } else {
          const lastItemTitle = Session.getLastItemTitle();
          if (lastItemTitle) {
            for (let i = 0; i < category.items.length; i++) {
              const ci = category.items[i];
              if (ci.title === lastItemTitle) {
                item = ci;
                break;
              }
            }
          }
        }

        const isCategories = feed.getUniqueCategoryCount() > 1;
        if (state && state.browseScreen) {
          setTimeout(() => {
            state.browseScreen.sliderRef.current.focus();
          }, 0);
        }
        return {
          feed: feed,
          category: category,
          currentItem: (isCategories && !item) ? category : (item ? item : category.items[0]),
          menuMode: (isCategories && !item) ? ModeEnum.CATEGORIES : ModeEnum.APPS
        }
      }
    }
    return null;
  }

  getLongTitle(item) {
    return item.longTitle ? item.longTitle : item.title;
  }

  getSearchItems(searchTerm) {
    const { feed } = this.state;
    const { items, cache } = getSearchItems(feed, searchTerm, this.MAX_SLIDES, this._searchCache);
    this._searchCache = cache;
    return items;
  }

  render() {
    const { disable, feeds, hide, onSettings } = this.props;
    const { category, currentItem, feed, menuMode, display, searchTerm } = this.state;
    const { categoryRef, focusGrid, button1Ref, screenContext, settingsRef, searchRef,
      settingsDetailsRef, searchDetailsRef, sliderRef, webrcadeDivRef, MAX_SLIDES } = this;
    const { ModeEnum } = this;
    const { context } = this.props;

    const isCategories = (menuMode === ModeEnum.CATEGORIES);
    const isFeeds = (menuMode === ModeEnum.FEEDS);
    const isSearching = searchTerm !== '';
    const items = isSearching ? this.getSearchItems(searchTerm) :
      isFeeds ? feeds : isCategories ? feed.getCategories() : category.items;

    let itemId = 0, info = null, lastFeedItemMatch = false;;

    if (currentItem) {
      itemId = currentItem.id;
      info = (isSearching && currentItem && currentItem._category)
        ? getSearchItemInfo(this, currentItem)
        : isFeeds ? getFeedInfo(this, currentItem, itemId) :
          isCategories ? getCategoryInfo(this, currentItem) :
            getAppInfo(this, currentItem);

      if ((feed.getTitle() === Session.getLastFeedTitle()) &&
        (category && (category.title === Session.getLastCategoryTitle())) &&
        (currentItem.title === Session.getLastItemTitle())) {
        // console.log(feed.getTitle());
        // console.log(category.title);
        // console.log(currentItem.title);
        lastFeedItemMatch = true;
      } else {
        // console.log("### NOT MATCH!");
        // console.log(feed.getTitle());
        // console.log(category.title);
        // console.log(currentItem.title);
      }
    }

    const hideTitleBar = settings.getHideTitleBar();

    const openSearch = () => context.showSearchScreen(true, {
      initialValue: searchTerm,
      getCount: term => {
        const t = term.trim();
        if (t === '') return 0;
        const { feed } = this.state;
        const { items, cache } = getSearchItems(feed, t, this.MAX_SLIDES, this._searchCountCache);
        this._searchCountCache = cache;
        return items.filter(i => !i.duplicate).length;
      },
      onSearch: term => this.onSearchChange(term),
      onApply: term => {
        if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
        this._searchDebounceTimer = null;
        const trimmed = term.trim();
        const apply = () => {
          context.showSearchScreen(false);
          if (trimmed === '' || this.getSearchItems(trimmed).filter(i => !i.duplicate).length === 0) {
            this.clearSearch();
          } else {
            this.setState({ searchTerm: trimmed });
          }
        };
        iosClose(apply);
      },
      onClear: () => { this.clearSearch(); }
    });

    return (
      <WebrcadeContext.Provider value={screenContext}>
        <div ref={webrcadeDivRef} style={{height: window.innerHeight + "px", opacity: display ? "1" : "0"}} className="webrcade">
          <div className={'webrcade-outer' +
            (hide === true ? ' webrcade-outer--hide' : '')}>
            <Message />
            {!hideTitleBar && (
              <div className="header-nav">
                <div className="header-nav-left">&nbsp;</div>
                <div className="header-nav-center"><Logo /></div>
                <div className="header-nav-right">
                  {!isFeeds && (
                    <ImageButton
                        className={"settings-button"}
                        onPad={e => focusGrid.moveFocus(e.type, searchRef)}
                        onClick={() => openSearch()}
                        ref={searchRef}
                        imgSrc={SearchWhiteImage}
                      />
                  )}
                  <ImageButton
                      className={"settings-button"}
                      onPad={e => focusGrid.moveFocus(e.type, settingsRef)}
                      onClick={() => onSettings()}
                      ref={settingsRef}
                      imgSrc={SettingsWhiteImage}
                    />
                </div>
              </div>
            )}
            <AppDetails
              itemKey={itemId}
              title={info.title}
              description={info.description}
              subTitle={info.subTitle}
              backgroundSrc={info.backgroundSrc}
              defaultBackgroundSrc={info.defaultBackgroundSrc}
              settingsButtonRef={settingsDetailsRef}
              searchButtonRef={searchDetailsRef}
              focusGrid={focusGrid}
              pixelated={info.backgroundPixelated}
              disable={disable}
              onSettings={onSettings}
              hideSearch={isFeeds}
              onSearch={() => openSearch()}
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
                  {info.isButton2Enabled ? (
                    (info.button2OnFile ? (
                      <FileButton
                        onPad={e => focusGrid.moveFocus(e.type, this.button2Ref)}
                        onFileSelect={info.button2OnFile}
                        ref={this.button2Ref}
                        imgSrc={info.button2Img}
                        hoverImgSrc={info.button2HoverImg}
                        label={info.button2Label}
                      />
                    ) : (
                      <ImageButton
                        onPad={e => focusGrid.moveFocus(e.type, this.button2Ref)}
                        onClick={info.button2OnClick}
                        ref={this.button2Ref}
                        imgSrc={info.button2Img}
                        hoverImgSrc={info.button2HoverImg}
                        label={info.button2Label}
                      />
                    )))
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
              lastItemTitle={lastFeedItemMatch ? Session.getLastItemTitle() : null}
              onSelected={item => { if (item) this.setState({ currentItem: item }); }}
              onClick={() => button1Ref.current.focus()} />
          </div>
        </div>
      </WebrcadeContext.Provider>
    );
  }
};

