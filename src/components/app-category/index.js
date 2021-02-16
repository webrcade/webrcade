import React, { Component } from "react";

require("./style.scss");

export class AppCategory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label } = this.props;
        return (
            <div className="app-category">{label}</div>
        );
    }
};

export default AppCategory;
