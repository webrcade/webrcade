import React, { Component } from "react";
import SliderControl from "./slider-control";
import SliderItem from "./slider-item";

require("./style.scss");

export class slider extends Component {
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
      focused: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { apps, onSelected } = this.props;
    const { selectedItem } = this.state;
    if (
      ((prevProps.apps !== apps) ||
        (prevState.selectedItem !== selectedItem)) && onSelected) {
      onSelected(apps[selectedItem]);
    }
  }

  // alter number of items in row on window resize
  handleWindowResize = () => {
    if (window.innerWidth > 1440) {
      this.setState({ itemsInRow: 8 });
    } else if (window.innerWidth >= 1000) {
      this.setState({ itemsInRow: 7 });
    } else if (window.innerWidth < 1000) {
      this.setState({ itemsInRow: 6 });
    }
  };

  // render the slider contents
  renderSliderContent = () => {
    // console.log('RENDER');
    const { sliderHasMoved, itemsInRow, lowestVisibleIndex, selectedItem, focused } = this.state;
    const { apps } = this.props;
    const totalItems = apps.length;

    // slider content made up of left, mid, and right portions to allow continous cycling
    const left = [];
    const mid = [];
    const right = [];

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
      sliderContents.push(
        <SliderItem
          app={apps[index]}
          key={`${apps[index].id}-${index}`}
          width={100 / itemsInRow}
          selected={selectedItem === index && focused}
          onClick={() => { this.handleItemClicked(index) }}
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
    const { lowestVisibleIndex, itemsInRow, sliderMoving } = this.state;
    const { apps } = this.props;
    const totalItems = apps.length;

    if (sliderMoving) return;

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
        selectedItem: (newIndex + itemsInRow - 1) % apps.length
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
    const { sliderHasMoved, lowestVisibleIndex, itemsInRow, sliderMoving } = this.state;
    const { apps } = this.props;
    const totalItems = apps.length;

    if (sliderMoving) return;

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
    const { selectedItem, lowestVisibleIndex, itemsInRow, sliderMoving, focused } = this.state;
    const max = lowestVisibleIndex + itemsInRow;
    const { apps } = this.props;
    const totalItems = apps.length;

    if (sliderMoving || !focused) return;

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
    const { selectedItem, lowestVisibleIndex, sliderMoving, focused } = this.state;
    const { apps } = this.props;
    const totalItems = apps.length;

    if (sliderMoving || !focused) return;

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
    this.setState({focused: true});
  }

  onBlur = () => {
    this.setState({focused :false});
  }

  render() {
    const {
      sliderHasMoved,
      itemsInRow,
      sliderMoving,
      sliderMoveDirection,
      movePercentage
    } = this.state;
    const { apps } = this.props;

    // return null if apps are not loaded
    if (!apps.length) {
      return null;
    }

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

    return (
      // <div className="slider" tabIndex="0"></div>
      <div className="slider" tabIndex="0" onFocus={this.onFocus} onBlur={this.onBlur}>
        {sliderHasMoved && (
          <SliderControl arrowDirection={"left"} onClick={this.handlePrevPage} />
        )}
        <div className="slider-content" style={style}>
          {this.renderSliderContent()}
        </div>

        <SliderControl arrowDirection={"right"} onClick={this.handleNextPage} />
      </div>
    );
  }
}

export default slider;
