import React, { Component } from "react";
import { GamepadEnum, Swipe, WebrcadeContext, LOG } from '@webrcade/app-common'
import SliderControl from "./slider-control";
import SliderItem from "./slider-item";

require("./style.scss");

class Slider extends Component {
  constructor() {
    super();
    this.state = {
      sliderHasMoved: true, // boolean tracking if slider has moved from its initial position
      sliderMoveDirection: null, // direction of movement of slider
      sliderMoving: false, // boolean for animation of slider
      movePercentage: 0, // amount to offset slider
      lowestVisibleIndex: 0, // lowest visible index of slider items
      itemsInRow: 6, // number of items to be displayed across screen
      selectedItem: 0,
      focused: false,
      sliderHidden: false,
      scrollable: true,
      uniqueItems: 0
    };
    this.keyDown = false;
    this.swipe = null;
    this.setMinHeight = false;
    this.minHeightTimeoutId = null;
  }

  gamepadCallback = e => {
    const { onPad } = this.props;
    const { focused } = this.state;

    if (!focused) return;

    switch (e.type) {
      case GamepadEnum.LEFT:
        this.selectPrev();
        break;
      case GamepadEnum.RIGHT:
        this.selectNext();
        break;
      case GamepadEnum.A:
        this.onClick();
        break;
      case GamepadEnum.LBUMP:
        this.handlePrevPage();
        break;
      case GamepadEnum.RBUMP:
        this.handleNextPage();
        break;
      case GamepadEnum.UP:
      case GamepadEnum.DOWN:
        if (onPad) onPad(e);
        break;
      default:
        break;
    }
    return true;
  }

  componentDidMount() {
    const { gamepadNotifier } = this.context;
    const { container } = this;

    if (container) {
      this.swipe = new Swipe(container);
      this.swipe.onLeft = () => {this.focus(); this.handleNextPage()};
      this.swipe.onRight = () => {this.focus(); this.handlePrevPage()};
    }

    if (gamepadNotifier) {
      gamepadNotifier.addCallback(this.gamepadCallback);
    }
    
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("orientationchange", this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    const { gamepadNotifier } = this.context;
    const { swipe } = this;

    if (swipe) {
      swipe.unregister();
    }

    if (gamepadNotifier) {
      gamepadNotifier.removeCallback(this.gamepadCallback);
    }

    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("orientationchange", this.handleWindowResize);
  }  

  shouldComponentUpdate(nextProps, nextState) {
    const { items, onSelected } = this.props;

    let ret = true;    

    const unique = nextProps.items.reduce((
      acc, curr) => acc + (curr.duplicate ? 0 : 1), 0);
    const scrollable = unique > nextState.itemsInRow;

    // console.log("Unique: " + unique);
    // console.log("Items in row: " + nextState.itemsInRow);
    // console.log("Scrollable: " + scrollable);

    if (nextProps.items !== items) {
      ret = false;
      this.setState({
        selectedItem: 0,
        lowestVisibleIndex: 0,
        sliderHidden: true,
        uniqueItems: unique,
        scrollable: scrollable
      },
        () => {
          setTimeout(() => {
            this.setState({
              sliderHidden: false
            });
          }, 250);  

          if (onSelected) {
            onSelected(nextProps.items[0]);
          }
        });
    } else if (unique !== nextState.uniqueItems || scrollable !== nextState.scrollable) {
      this.setState({
        uniqueItems: unique,
        scrollable: scrollable
      });
    }

    return ret;
  }

  componentDidUpdate(prevProps, prevState) {
    const { items, maxSlides, onSelected } = this.props;
    const { itemsInRow, selectedItem, lowestVisibleIndex, scrollable} = this.state;

    // console.log('selected: ' + selectedItem);
    // console.log('lowest visible:' + lowestVisibleIndex);
    // console.log('items in row: ' + itemsInRow);
    
    if (prevState.scrollable && !scrollable) {
      console.log("Reset selected item due to scrollable changing.");
      this.setState({
        selectedItem: 0,
        lowestVisibleIndex: 0
      });
    } else {
      if (prevState.itemsInRow !== itemsInRow) {
        const maxIndex = items.length - 1;
        let endIndex = lowestVisibleIndex + itemsInRow - 1;
        if (endIndex > maxIndex) {
          endIndex = maxIndex;
        }
        const inRange = (selectedItem >= lowestVisibleIndex && selectedItem <= endIndex);
        if (!inRange) {
          console.log('Reset selected item due to items in row changing.');
          this.setState({
            selectedItem: lowestVisibleIndex
          });
        }
      }
    }

    if ((prevState.selectedItem !== selectedItem) && onSelected) {
      onSelected(items[selectedItem]);
    }

    if (itemsInRow > maxSlides) {
      throw new Error(`Max slides exceeded (${maxSlides}, ${itemsInRow})`);
    }
  }

  onClick() {
    const { items, onClick } = this.props;
    const { selectedItem } = this.state;

    if (onClick) {
      onClick(items[selectedItem]);
    }
  }

  keyDownListener = e => {
    this.keyDown = true;
  }

  keyUpListener = e => {
    if (!this.keyDown) return;
    this.keyDown = false;

    switch (e.code) {
      case 'ArrowRight':
        this.selectNext();
        break;
      case 'ArrowLeft':
        this.selectPrev();
        break;
      case 'PageDown':
      case 'ArrowDown':
        this.handleNextPage();
        break;
      case 'PageUp':
      case 'ArrowUp':
        this.handlePrevPage();
        break;
      case 'Enter':
        this.onClick();
        break;
      default:
        break;
    }
  };

  // alter number of items in row on window resize
  handleWindowResize = () => {
    this.resetMinHeight();
    //alert(window.innerWidth);
    if (window.innerWidth <= 950 && window.innerHeight <= 400) {
      /* Mobile sizing (experimental) */
      this.setState({ itemsInRow: 6 });
    } else if (window.innerWidth > 1440) {
      this.setState({ itemsInRow: 8 });
    } else if (window.innerWidth >= 1152) {
      this.setState({ itemsInRow: 7 });
    } else if (window.innerWidth >= 864) {
      this.setState({ itemsInRow: 6 });
    } else if (window.innerWidth < 864) {
      this.setState({ itemsInRow: 5 });
    }
  };

  // render the slider contents
  renderSliderContent = () => {
    // console.log('RENDER');
    const { focused, itemsInRow, lowestVisibleIndex, scrollable, selectedItem, sliderHasMoved } = this.state;
    const { getTitle, getThumbnailSrc, getDefaultThumbnailSrc, items } = this.props;
    const totalItems = items.length;

    const onImageLoadedFunc = (e) => {      
      if (!this.setMinHeight) {
        this.resetMinHeight();
      }
    }

    // slider content made up of left, mid, and right portions to allow continous cycling
    const left = [];
    const mid = [];
    const right = [];

    if (lowestVisibleIndex >= totalItems ) {
      LOG.info('Index out of bounds, not rendering.');
      return;
    }

    // gets the indexes to be displayed
    for (let i = 0; i < itemsInRow; i++) {
      // left
      if (sliderHasMoved) {
        if (lowestVisibleIndex + i - itemsInRow < 0) {
          // console.log('left (1): ' + (totalItems - itemsInRow + lowestVisibleIndex + i));
          left.push(totalItems - itemsInRow + lowestVisibleIndex + i);
        } else {
          // console.log('left (1): ' + (i + lowestVisibleIndex - itemsInRow));
          left.push(i + lowestVisibleIndex - itemsInRow); // issue here
        }
      }

      // mid
      if (i + lowestVisibleIndex >= totalItems) {
        // console.log('mid (1): ' + (i + lowestVisibleIndex - totalItems));
        mid.push(i + lowestVisibleIndex - totalItems);
      } else {
        // console.log('mid (2): ' + (i + lowestVisibleIndex));
        mid.push(i + lowestVisibleIndex);
      }

      // right
      if (i + lowestVisibleIndex + itemsInRow >= totalItems) {
        // console.log('right (1): ' + (i + lowestVisibleIndex + itemsInRow - totalItems));
        right.push(i + lowestVisibleIndex + itemsInRow - totalItems);
      } else {
        // console.log('right (2): ' + (i + lowestVisibleIndex + itemsInRow));
        right.push(i + lowestVisibleIndex + itemsInRow);
      }
    }

    // combine left, mid, right to have all indexes
    const combinedIndex = [...left, ...mid, ...right];

    // add on leading and trailing indexes for peek image when sliding
    if (sliderHasMoved) {
      const trailingIndex =
        combinedIndex[combinedIndex.length - 1] === totalItems - 1
          ? 0
          : combinedIndex[combinedIndex.length - 1] + 1;

      combinedIndex.push(trailingIndex);
    }

    const leadingIndex =
      combinedIndex[0] === 0 ? totalItems - 1 : combinedIndex[0] - 1;
    combinedIndex.unshift(leadingIndex);    

    const sliderContents = [];
    for (let index of combinedIndex) {      
      const item = items[index];      
      const thumbnailSrc = getThumbnailSrc ? getThumbnailSrc(item) : '';
      const key = item.id ? item.id : `${item.title}-${index}-${thumbnailSrc}`;
      const hide = item.duplicate === true && !scrollable;
      sliderContents.push(
        <SliderItem
          title={getTitle ? getTitle(item) : ''}
          thumbnailSrc={getThumbnailSrc ? getThumbnailSrc(item) : ''}
          defaultThumbnailSrc={getDefaultThumbnailSrc ? getDefaultThumbnailSrc(item) : ''}
          key={key}
          width={100 / itemsInRow}
          selected={selectedItem === index && focused}
          onClick={() => { this.handleItemClicked(index) }}
          hide={hide}
          onImageLoaded={onImageLoadedFunc}
        />
      );
    }

    // adds empty divs to take up appropriate spacing when slider at initial position
    if (!sliderHasMoved) {
      for (let i = 0; i < itemsInRow; i++) {
        sliderContents.unshift(
          <div
            className="slider-item"
            style={{ width: `${100 / itemsInRow}%` }}
            key={i}
          />
        );
      }
    }

    return sliderContents;
  };

  handlePrevPage = () => {
    const { focused, itemsInRow, lowestVisibleIndex, scrollable, sliderMoving } = this.state;
    const { items } = this.props;
    const totalItems = items.length;

    if (sliderMoving || !focused || !scrollable) return;

    // get the new lowest visible index
    let newIndex;
    if (lowestVisibleIndex < itemsInRow && lowestVisibleIndex !== 0) {
      newIndex = 0;
    } else if (lowestVisibleIndex - itemsInRow < 0) {
      newIndex = totalItems - itemsInRow;
    } else {
      newIndex = lowestVisibleIndex - itemsInRow;
    }

    // get the move percentage
    let newMovePercentage;
    if (lowestVisibleIndex === 0) {
      newMovePercentage = 0;
    } else if (lowestVisibleIndex - newIndex < itemsInRow) {
      newMovePercentage =
        ((itemsInRow - (lowestVisibleIndex - newIndex)) / itemsInRow) * 100;
    } else {
      newMovePercentage = 0;
    }

    this.setState(
      {
        sliderMoving: true,
        sliderMoveDirection: "left",
        movePercentage: newMovePercentage,
        selectedItem: (newIndex + itemsInRow - 1) % items.length
      },
      () => {
        setTimeout(() => {
          this.setState({
            lowestVisibleIndex: newIndex,
            sliderMoving: false,
            sliderMoveDirection: null,
            newMovePercentage: 0,
          });
        }, 750);
      }
    );
  };

  handleNextPage = () => {
    const { focused, itemsInRow, lowestVisibleIndex, scrollable, 
      sliderHasMoved, sliderMoving } = this.state;
    const { items } = this.props;
    const totalItems = items.length;

    if (sliderMoving || !focused || !scrollable) return;

    // get the new lowest visible index
    let newIndex;
    if (lowestVisibleIndex === totalItems - itemsInRow) {
      newIndex = 0;
    } else if (lowestVisibleIndex + itemsInRow > totalItems - itemsInRow) {
      newIndex = totalItems - itemsInRow;
    } else {
      newIndex = lowestVisibleIndex + itemsInRow;
    }

    // get the move percentage
    let newMovePercentage;
    if (newIndex !== 0) {
      newMovePercentage = ((newIndex - lowestVisibleIndex) / itemsInRow) * 100;
    } else {
      newMovePercentage = 100;
    }

    this.setState(
      {
        sliderMoving: true,
        sliderMoveDirection: "right",
        movePercentage: newMovePercentage,
        selectedItem: newIndex
      },
      () => {
        setTimeout(() => {
          this.setState({
            lowestVisibleIndex: newIndex,
            sliderMoving: false,
            sliderMoveDirection: null,
            movePercentage: 0,
          });
        }, 750);
      }
    );

    if (!sliderHasMoved) {
      this.setState({ sliderHasMoved: true });
    }
  };

  handleItemClicked(index) {
    this.setState({
      selectedItem: index
    });
  }

  selectNext() {
    const { focused, itemsInRow, lowestVisibleIndex, scrollable, selectedItem, 
      sliderMoving, uniqueItems } = this.state;
    const { items } = this.props;

    const max = lowestVisibleIndex + itemsInRow;    
    const totalItems = items.length;

    if (sliderMoving || !focused || 
      (!scrollable && selectedItem === (uniqueItems - 1))) return;

    let newItem = selectedItem + 1;

    if (newItem === max) {
      this.handleNextPage();
    }

    newItem = newItem % totalItems;

    this.setState({
      selectedItem: newItem
    });
  }

  selectPrev() {
    const { focused, lowestVisibleIndex, scrollable, selectedItem, sliderMoving } = this.state;
    const { items } = this.props;

    const totalItems = items.length;

    if (sliderMoving || !focused || (!scrollable && selectedItem === 0)) return;

    let newItem = selectedItem - 1;

    if (newItem < lowestVisibleIndex) {
      this.handlePrevPage();
    }

    newItem = newItem < 0 ? totalItems - 1 : newItem;

    this.setState({
      selectedItem: newItem
    });
  }

  onFocus = () => {
    this.keyDown = false;
    this.setState({ focused: true });
    document.addEventListener("keyup", this.keyUpListener);
    document.addEventListener("keydown", this.keyDownListener);
  }

  onBlur = () => {
    this.keyDown = false;
    this.setState({ focused: false });
    document.removeEventListener("keyup", this.keyUpListener);
    document.removeEventListener("keydown", this.keyDownListener);
  }

  focus() {
    const { focused } = this.state;
    const { container } = this;

    if (!focused && container) {
      container.focus();
      return true;
    }
    return false;
  }

  resetMinHeight() {
    const { container } = this;
    if (!container) return;

    console.log("Resetting min height.");
    if (this.minHeightTimeoutId) {
      window.clearTimeout(this.minHeightTimeoutId)
    }
    container.style.minHeight = '0px';
    this.minHeightTimeoutId = setTimeout(() => {        
      const height = container.offsetHeight;
      if (height > 0) {
        container.style.minHeight = container.offsetHeight + "px";         
        console.log("Min height: " + container.style.minHeight);
        this.setMinHeight = true;
      }    
    }, 1000);    
  }

  render() {
    const {
      itemsInRow,
      movePercentage,
      scrollable,
      sliderHasMoved,      
      sliderHidden,
      sliderMoveDirection,
      sliderMoving      
    } = this.state;
    const { items } = this.props;

    // style object to determine movement of slider
    let style = {};
    if (sliderMoving) {
      let translate = "";
      if (sliderMoveDirection === "right") {
        translate = `translateX(-${100 + movePercentage + 100 / itemsInRow}%)`;
      } else if (sliderMoveDirection === "left") {
        translate = `translateX(-${movePercentage + 100 / itemsInRow}%)`;
      }

      style = {
        transform: translate,
        transitionDuration: "750ms",
      };
    } else {
      style = {
        transform: `translateX(-${100 + (sliderHasMoved ? 100 / itemsInRow : 0)
          }%)`,
      };
    }
    
    let sliderStyle = {}
    if (sliderHidden) {
      sliderStyle = {
        transform: 'translateY(150%)',
        opacity: 0
      }
    } else {
      sliderStyle = {
        transform: 'translateY(0%)',
        transition: '.65s, opacity .8s ease-in-out',
        opacity: 1
      }
    }

    if (items.length === 0) {
      return (
        <div className="slider slider-no-items"> No items found to display.</div>
      );
    } else {
      return (
        <div className="slider" tabIndex="0" 
          ref={(container) => { this.container = container; }}
          onFocus={this.onFocus}
          onBlur={this.onBlur}>
          {sliderHasMoved && (
            <SliderControl 
              arrowDirection={"left"} 
              onClick={this.handlePrevPage}
              hide={!scrollable} />
          )}
          <div style={sliderStyle}>
            <div className="slider-content" style={style}>
              {items.length > 0 ? this.renderSliderContent() : null}
            </div>
          </div>
          <SliderControl 
            arrowDirection={"right"} 
            onClick={this.handleNextPage} 
            hide={!scrollable} />
        </div>
      );
    }
  }
}

Slider.contextType = WebrcadeContext;

export default Slider;
