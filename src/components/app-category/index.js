import React, { Component } from "react";
import { Icon } from "@iconify/react";
import chevronRight from "@iconify/icons-mdi/chevron-right";

require("./style.scss");

export class AppCategory extends Component {
  constructor() {
    super();
  }

  onClick = (e) => {
    // this.button.blur();
  }

  componentDidMount() {
    // const { focused } = this.props;
    // if (focused) {
    //     this.button.focus();        
    // }
  }

  render() {
    const { label } = this.props;
    return (
      <button ref={(button) => { this.button = button; }} onClick={this.onClick} className="app-category">
        <div className="app-category-label"><span>{label}</span></div>
        <div className="app-category-flyout"><span>Show Categories</span></div>
        <div className="app-category-caret"><Icon icon={chevronRight} /></div>
      </button>
    );
  }
};

export default AppCategory;
