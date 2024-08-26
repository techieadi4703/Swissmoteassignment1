import React from 'react';
import './Coin.css';

function Coin({ side }) {
  return (
    <div className={`coin ${side === '0' ? 'heads' : 'tails'}`}>
      {side === '0' ? 'Heads' : 'Tails'}
    </div>
  );
}

export default Coin;
