import React from "react";

require("./style.scss");

const SliderItem = ({ width, selected, onClick, title, thumbnailSrc, hide }) => {
  return (
    <div className="slider-item" style={{ width: `${width}%`, visibility: hide ? 'hidden' : 'visible' }} onClick={onClick}>
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')}>
        <img src={thumbnailSrc} key={thumbnailSrc} alt={title} 
          onError={e => {console.log('error image' + e.target.src)}}
          onLoad={e => {/*console.log(e.target.naturalWidth + "x" + e.target.naturalHeight + ", " + e.target.src)*/}}/>
        <div className={'slider-item-title' + (selected ? ' slider-item-title__selected' : '')}>{title}</div>
      </div>      
    </div>
  );
};

export default SliderItem;
