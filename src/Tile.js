import React from 'react';

const Tile = ({bg, claim, color, handleTileClick, id, size, title}) => {
  if (claim) {
    return (
      <div className="tile">
          <h1>{title}</h1>
          <img src={"https://robohash.org/" + id + "?format=jpg&size=" + size + "&bgset=" + bg + "&color=" + color} alt='robot'></img>
           <button className="btn-claim" onClick={handleTileClick}>Claim {title}</button>
      </div>
    )
  } else {
    return (
      <div className="tile">
      <h1>{title}</h1>
      <img src={"https://robohash.org/" + id + "?format=jpg&size=250x250&bgset=" + bg + "&color=" + color} alt='robot'></img>
      <p>{title}</p>
  </div>
    )
  }
  }
  
  export default Tile;