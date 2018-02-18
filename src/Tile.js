import React from 'react';

const Tile = ({bg, color, handleTileClick, id, title}) => {
    return (
      <div className="tile">
          <h1>{title}</h1>
          <img src={"https://robohash.org/" + id + "?format=jpg&size=250x250&bgset=" + bg + "&color=" + color} alt='robot'></img>
          <button onClick={handleTileClick}>Claim</button>
      </div>
    )
  }
  
  export default Tile;