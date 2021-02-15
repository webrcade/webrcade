import React, { Component } from "react";

require("./style.scss");

export class ImageButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { label, imgSrc } = this.props;
        return (
            <button class="image-button"><img src={imgSrc}></img><div>{label}</div></button>
        );
    }
};

export default ImageButton;
