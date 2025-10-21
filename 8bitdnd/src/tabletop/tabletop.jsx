import React, { useState, useEffect } from 'react';
import { CharacterCard } from './charactercard';
import './tabletop.css'; 

export function Tabletop() {
  const [character, setCharacter] = useState(null);
  const [tokens, setTokens] = useState({
    pc: { top: 50, left: 50 },
    enemy: { top: 100, left: 100 },
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const savedCharacter = localStorage.getItem("tabletopCharacter");
      if (savedCharacter) {
        setCharacter(JSON.parse(savedCharacter));
      }
    } catch (error) {
      console.error("Error loading character:", error);
    }
  }, []);

  const handleDragStart = (id, e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Create a styled div for drag image using CSS classes
    const dragImage = document.createElement('div');
    dragImage.className = `drag-image ${id}`;
    dragImage.textContent = id === 'pc' ? 'PC' : 'E';
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
    
    setTimeout(() => document.body.removeChild(dragImage), 0);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const mapRect = e.currentTarget.getBoundingClientRect();
    
    const newLeft = e.clientX - mapRect.left - dragOffset.x;
    const newTop = e.clientY - mapRect.top - dragOffset.y;

    setTokens(prevTokens => ({
      ...prevTokens,
      [id]: { top: newTop, left: newLeft },
    }));
  };

  return (
    <>
      <div className="landscape-warning">
        For best experience, please rotate your device to landscape mode.
      </div>
      <main className="tabletop">
        <div 
          className="map"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {Object.entries(tokens).map(([id, pos]) => (
            <div
              key={id}
              className={`token ${id}`}
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
              }}
              draggable
              onDragStart={(e) => handleDragStart(id, e)}
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