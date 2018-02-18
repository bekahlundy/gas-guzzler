import React from 'react';

const Tile = ({bg, claim, color, handleTileClick, id, title, renderButton}) => {
  if (renderButton) {
    return (
      <div className="tile">
          <h1>{title}</h1>
          <img src={"https://robohash.org/" + id} alt='robot'></img>
           <button onClick={handleTileClick}>Claim</button>
      </div>
    );
  } else {
    return (
      <div className="tile">
          <h1>{title}</h1>
          <img src={"https://robohash.org/" + id} alt='robot'></img>
      </div>
    );
  } 
}
  
  export default Tile;