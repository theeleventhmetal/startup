import React from 'react';
import { CharacterCard } from './charactercard';
import './tabletop.css'; 

const character = JSON.parse(localStorage.getItem("tabletopCharacter"));

export function Tabletop() {
  return (
    <>
      <div className="landscape-warning">
          For best experience, please rotate your device to landscape mode.
      </div>
      <main className="tabletop">
        <div className="map">
          <div className="token pc" style={{ top: '50px', left: '50px' }}>PC</div>
          <div className="token enemy" style={{ top: '100px', left: '100px' }}>E</div>
        </div>
        
          <div className="character-sheet">
            <CharacterCard character={character} />
          </div>
      </main>
    </>
  );
}