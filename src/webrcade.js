import React, { Component } from "react";
import Slider from "./components/slider";
import AppDetails from "./components/app-details";
import AppCategory from "./components/app-category";
import ImageButton from "./components/image-button";
import { GamepadNotifier, FocusGrid } from "./input"
import { AppRegistry } from './apps';
import { WebrcadeFeed, getDefaultFeed } from './feed';
import { isDev } from '@webrcade/app-common'

import PlayImageWhite from "./images/play-white.svg"
import PlayImageBlack from "./images/play-black.svg"

require("./style.scss");

export class Webrcade extends Component {
  constructor() {
    super();

    const feed = new WebrcadeFeed(getDefaultFeed(), (3 * this.MAX_SLIDES + 2));
    const category = feed.getCategories()[0];

    this.state = {
      category: category,
      currentItem: category.items[0],
      mode: this.ModeEnum.MENU,
      menuMode: this.MenuModeEnum.APPS,
      feed: feed
    };

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

  MAX_SLIDES = 8;

  ModeEnum = {
    MENU: "menu",
    APP: "app"
  }

  MenuModeEnum = {
    APPS: "apps",
    CATEGORIES: "categories"
  }

  HASH_PLAY = "play";

  focusGrid = new FocusGrid();

  gamepadCallback = e => {
    const { focusGrid } = this;
    focusGrid.focus();
    return true;
  }

  popstateHandler = (e) => {
    const { ModeEnum, appRef } = this;
    const { mode } = this.state;

    // Returning to menu
    if (mode === ModeEnum.APP) {
      let properExit = false; // In dev we can't access frame (different port)
      if (appRef.current) {
        try {
          const content = appRef.current.contentWindow;
          if (content && content.app) {                          
            properExit = true;

            // Exit from app is asynchronous (allow for async saves, etc.)
            content.app.exit(null, false)
              .catch((e) => console.error(e)) // TODO: Proper error handling
              .finally(() => this.setState({ mode: ModeEnum.MENU }));
          }
        } catch (e) {
          if (!isDev()) console.error(e);
        }
      }
      if (!properExit) {
        // We can't do a proper exit in dev mode (when back is pressed)
        this.setState({ mode: ModeEnum.MENU });
      }
    }
  }

  componentDidMount() {
    const { ModeEnum } = this;
    const { mode } = this.state;

    window.addEventListener('popstate', this.popstateHandler, false);

    // Clear hash if displaying menu
    const hash = window.location.href.indexOf('#');
    if (mode === ModeEnum.MENU && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }      

    // Start the gamepad notifier 
    GamepadNotifier.instance.start();
    GamepadNotifier.instance.setDefaultCallback(this.gamepadCallback);

    this.setState({ initial: true });
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstateHandler);

    // Stop the gamepad notifier
    GamepadNotifier.instance.stop();
    GamepadNotifier.instance.setDefaultCallback(null);
  }

  componentDidUpdate(prevProps, prevState) {
    const { mode, initial } = this.state;
    const { ModeEnum, sliderRef } = this;

    if (initial ||
      (prevState.mode === ModeEnum.APP && mode === ModeEnum.MENU)) {
      this.setState({ initial: false });
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
                isSelectable={!isCategories}
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
        <iframe
          ref={appRef}
          style={!isDev() ? { display: "none" } : {}}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; gamepad"
          title={reg.getTitle(currentItem)}
          src={reg.getLocation(currentItem)} />
      </div>
    )
  }

  render() {
    const { mode } = this.state;
    const { ModeEnum } = this;

    return (
      <>
        {this.renderMenu()}
        {mode === ModeEnum.APP ? this.renderApp() : null}
      </>
    );
  }
}

export default Webrcade;
