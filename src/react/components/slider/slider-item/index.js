import React, { useRef, useState } from "react";

require("./style.scss");

const preventDefault = (e) => { e.preventDefault(); }

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
      // if (e.target.naturalWidth !== 400 || e.target.naturalHeight !== 300) {
      //   console.log('image is not (400x300): ' + e.target.src + ", trying proxy, then default.");

      //   // Attempt to use proxy
      //   const proxyImg = new Image();
      //   proxyImg.onload = (e) => {
      //     const proxyTarget = e.target;
      //     showImage(proxyTarget.src);
      //   }
      //   proxyImg.onerror = (e) => {
      //     if (defaultThumbnailSrc) {
      //       loadDefault();
      //     }
      //   }
      //   const url = encodeURIComponent(img.src);
      //   proxyImg.src = `https://images.weserv.nl/?url=${url}&w=400&h=300&fit=cover&output=gif`;
      // }
      // else {
        showImage(img.src);
      // }
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
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')} style={{aspectRatio: "4/3", overflow: 'hidden'}}>
        <img
          style={{
            width: '100%',
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          src="images/default-thumb.png"
          onContextMenu={preventDefault}
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
