import React from "react";
import { AppRegistry } from '../../../apps'

require("./style.scss");

const SliderItem = ({ app, width, selected, onClick }) => {
  const reg = AppRegistry.instance;
  const { title } = app;
  return (
    <div className="slider-item" style={{ width: `${width}%` }} onClick={onClick}>
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')}>
        <img src={reg.getThumbnail(app)}  alt={title}/>
        <div className={'slider-item-title' + (selected ? ' slider-item-title__selected' : '')}>{reg.getTitle(app)}</div>
      </div>      
    </div>
  );
};

export default SliderItem;
