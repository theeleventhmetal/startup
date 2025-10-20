import React, { useState, useEffect } from 'react';
import { CharacterCard } from './charactercard';
import Draggable from 'react-draggable';
import './tabletop.css'; 

const character = JSON.parse(localStorage.getItem("tabletopCharacter"));

export function Tabletop() {
  const [tokens, setTokens] = useState({
    pc: { top: 50, left: 50 },
    enemy: { top: 100, left: 100 },
  });

  const handleDrag = (id, e) => {
    const tabletop = e.currentTarget.parentElement.getBoundingClientRect();
    const newLeft = e.clientX - tabletop.left - 25; // center offset
    const newTop = e.clientY - tabletop.top - 25;

    setTokens((prev) => ({
      ...prev,
      [id]: { top: newTop, left: newLeft },
    }));
  };
  return (
    <>
      <div className="landscape-warning">
          For best experience, please rotate your device to landscape mode.
      </div>
      <main className="tabletop">
        <div className="map">
          {Object.entries(tokens).map(([id, pos]) => (
            
            <div
              key={id}
              className={`token ${id}`}
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                position: 'absolute',
                cursor: 'grab',
              }}
              draggable
              onDragEnd={(e) => handleDrag(id, e)}
            >
              {id === 'pc' ? 'PC' : 'E'}
            </div>
          ))}
        </div>
        
          <div className="character-sheet">
            <CharacterCard character={character} />
          </div>
      </main>
    </>
  );
}