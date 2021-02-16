import React, { Component } from "react";

require("./style.scss");

export class AppCategory extends Component {
    onClick = (e) => {
        this.button.blur();
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
            <button ref={(button) => { this.button = button; }} onClick={this.onClick} className="app-category">{label}</button>
        );
    }
};

export default AppCategory;
