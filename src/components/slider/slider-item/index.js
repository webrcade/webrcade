import React from "react";

require("./style.scss");

const SliderItem = ({ game, width, selected, onClick }) => {
  return (
    <div className="slider-item" style={{ width: `${width}%` }} onClick={onClick}>
      <div className={'slider-item-container' + (selected ? ' slider-item-container__selected' : '')}>
        <img
          src={game.thumbnail} 
          alt={game.title}
          // src={'https://www.blockfort.com/wp-content/uploads/5814/3021/1922/NinjaGolf.png'}       
        />
        <div className={'slider-item-title' + (selected ? ' slider-item-title__selected' : '')}>{game.title}</div>
      </div>      
    </div>
  );
};

export default SliderItem;
