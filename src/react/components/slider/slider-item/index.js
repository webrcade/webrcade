import React from "react";

require("./style.scss");

const SliderItem = ({ width, selected, onClick, title, thumbnailSrc, defaultThumbnailSrc, hide, onImageLoaded }) => {
  return (
    <div className="slider-item" style={{ width: `${width}%`, visibility: hide ? 'hidden' : 'visible' }} onClick={onClick}>
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')}>
        <img src={thumbnailSrc} key={thumbnailSrc} alt={title} 
          onError={e => {
            console.log('error loading image: ' + e.target.src + ", using default: " + 
              (defaultThumbnailSrc ? defaultThumbnailSrc : '(none)'));
            if (defaultThumbnailSrc) e.target.src = defaultThumbnailSrc;
          }}
          onLoad={e => {
            // TODO: Don't do this if loading a default image (can create infinite loop)
            if (e.target.naturalWidth !== 400 || e.target.naturalHeight !== 300) {
              console.log('image is not (400x300): ' + e.target.src + ", using default: " + 
                  (defaultThumbnailSrc ? defaultThumbnailSrc : '(none)'));
              if (defaultThumbnailSrc) e.target.src = defaultThumbnailSrc;
            } else {
              if (onImageLoaded) onImageLoaded(e);
            }
          }}/>
        <div className={'slider-item-title' + (selected ? ' slider-item-title__selected' : '')}>{title}</div>
      </div>      
    </div>
  );
};

export default SliderItem;
