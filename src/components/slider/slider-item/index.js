import React from "react";

require("./style.scss");

const SliderItem = ({ app, width, selected, onClick }) => {
  return (
    <div className="slider-item" style={{ width: `${width}%` }} onClick={onClick}>
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')}>
        <img src={app.thumbnail}  alt={app.title}/>
        <div className={'slider-item-title' + (selected ? ' slider-item-title__selected' : '')}>{app.title}</div>
      </div>      
    </div>
  );
};

export default SliderItem;
