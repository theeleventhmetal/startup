import React, { useState, useEffect } from 'react';
import { CharacterCard } from './charactercard';
import './tabletop.css'; 

export function Tabletop() {
  const [character, setCharacter] = useState(null);
  const [tokens, setTokens] = useState({
    pc: { top: 50, left: 50 },
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Add these for better WebSocket preparation:
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [tokenColor, setTokenColor] = useState("#1E90FF");
  const [tokenLabel, setTokenLabel] = useState("PC");
  const [showJoinTable, setShowJoinTable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [tokenShape, setTokenShape] = useState("circle");

  // Custom hook for future WebSocket integration:
  const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);
    // ... WebSocket logic will go here
    return socket;
  };

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

  useEffect(() => {
    const savedTokens = localStorage.getItem("tokenPositions");
    if (savedTokens) {
      setTokens(JSON.parse(savedTokens));
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

    setTokens(prevTokens => {
      const newTokens = {
        ...prevTokens,
        [id]: { top: newTop, left: newLeft },
      };
      localStorage.setItem("tokenPositions", JSON.stringify(newTokens));
      return newTokens;
    });
  };

  const triggerJoinTable = () => {
    setShowJoinTable(true);
  };

  const handleJoinTable = () => {
  setRoomId(joinRoomCode);
  setShowJoinTable(false);
  setJoinRoomCode("");
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
          {/* Only render the player character token */}
          {tokens.pc && (
            <div
              key="pc"
              className={`token pc ${tokenShape}`}
              style={{
                top: `${tokens.pc.top}px`,
                left: `${tokens.pc.left}px`,
                backgroundColor: tokenColor,
                borderRadius: tokenShape === "circle" ? "50%" : "8px",
              }}
              draggable
              onDragStart={e => handleDragStart("pc", e)}
            >
              {tokenLabel}
            </div>
          )}
        </div>

        <div className="right-screen">
          <div className="character-sheet">
          <CharacterCard character={character} />
          </div>

          <div className="bottom-buttons">
            <button
              className="customize-token-button"
              onClick={() => setShowCustomizeModal(true)}
            >
              Customize Token
            </button>
            <button
              type="button"
              className="join-table-button"
              onClick={triggerJoinTable}
            >
              {roomId ? "Leave Table" : "Join Table"}
            </button>
          </div>

          
        </div>

        

        {showJoinTable && (
          <div className="join-table-overlay">
            <div className="join-table-modal">
              <div className="form-group">
                <label>Enter Table ID</label>
                <input 
                type="text"
                value={joinRoomCode}
                onChange={e => setJoinRoomCode(e.target.value)}
                />
                <button
                type="button"
                className="close-join-button"
                onClick={handleJoinTable}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showCustomizeModal && (
          <div className="join-table-overlay" onClick={() => setShowCustomizeModal(false)}>
            <div className="join-table-modal" onClick={e => e.stopPropagation()}>
              <div className="form-group">
                <label>Token Label</label>
                <input
                  type="text"
                  value={tokenLabel}
                  onChange={e => setTokenLabel(e.target.value)}
                  maxLength = {2}
                />

                <label>Token Color</label>
                <input
                  type="color"
                  value={tokenColor}
                  onChange={e => setTokenColor(e.target.value)}
                  style={{ width: "60px", height: "40px", border: "none", background: "none" }}
                />

                <label>Shape</label>
                <select
                  value={tokenShape}
                  onChange={e => setTokenShape(e.target.value)}
                >
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                </select>

                <button
                  type="button"
                  className="close-join-button"
                  onClick={() => {
                    // Save customization to state/localStorage/server as needed
                    setShowCustomizeModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}