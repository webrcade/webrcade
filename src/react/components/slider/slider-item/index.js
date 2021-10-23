import React, { useRef, useState } from "react";

require("./style.scss");

const SliderItem = ({ width, selected, onClick, title, thumbnailSrc, defaultThumbnailSrc, hide, onImageLoaded }) => {

  const imgRef = useRef(null);
  const [lastSrc, setLastSrc] = useState(null);
  
  if (thumbnailSrc !== lastSrc) {    
    const showImage = (src) => {      
      if (imgRef.current) {
        imgRef.current.src = src;                 
        if (onImageLoaded) onImageLoaded(imgRef.current);
      }
    }  
  
    const loadDefault = () => {
      if (defaultThumbnailSrc) {
        const defaultImg = new Image();
        defaultImg.onload = () => { showImage(defaultImg.src); };
        defaultImg.src = defaultThumbnailSrc;
      }  
    }
  
    // Attempt to load the image
    const img = new Image();
    img.onload = (e) => { 
      if (e.target.naturalWidth !== 400 || e.target.naturalHeight !== 300) {
        console.log('image is not (400x300): ' + e.target.src + ", using default.");
        if (defaultThumbnailSrc) {
          loadDefault();
        }
      }
      showImage(img.src); 
    };
    img.onerror = () => {
      // If an error occurred, attempt to load default thumbnail
      loadDefault();
    }
    img.src = thumbnailSrc;
    setLastSrc(thumbnailSrc);
  } 
  
  return (
    <div className="slider-item" style={{ width: `${width}%`, visibility: hide ? 'hidden' : 'visible' }} onClick={onClick}>
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')}>
        <img         
          src="images/default-thumb.png"
          key={thumbnailSrc} 
          alt={title} 
          ref={imgRef} 
        />
        <div className={'slider-item-title' + (selected ? ' slider-item-title__selected' : '')}>{title}</div>
      </div>      
    </div>
  );
};

export default SliderItem;
