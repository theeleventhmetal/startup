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
  const [socket, setSocket] = useState(null);
  const [myId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [myName, setMyName] = useState("Player"); // Or prompt for name

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WS message:", message);

      if (message.type === "add-tokens") {
        setTokens(prev => ({ ...prev, ...message.tokens }));
      }
      if (message.type === "token-moved") {
        setTokens(prev => ({
          ...prev,
          [message.tokenId]: {
            ...prev[message.tokenId],
            ...message.position
          }
        }));
      }
      if (message.type === "tokens-updated") {
        setTokens(message.tokens);
      }
      if (message.type === "room-state" && message.tokens) {
        setTokens(message.tokens);
      }
    };

    return () => ws.close();
  }, []);

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

  // useEffect(() => {
  //   const savedTokens = localStorage.getItem("tokenPositions");
  //   if (savedTokens) {
  //     setTokens(JSON.parse(savedTokens));
  //   }
  // }, []);

  const handleDragStart = (id, e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });

    // Create a styled div for drag image using current token customization
    const dragImage = document.createElement('div');
    dragImage.className = `drag-image ${id}`;
    dragImage.textContent = tokenLabel; // Use the current label

    // Apply styles to match the token
    dragImage.style.width = "35px";
    dragImage.style.height = "35px";
    dragImage.style.display = "flex";
    dragImage.style.alignItems = "center";
    dragImage.style.justifyContent = "center";
    dragImage.style.background = tokenColor; // Use the current color
    dragImage.style.color = "#fff";
    dragImage.style.fontFamily = "'Press Start 2P', monospace";
    dragImage.style.fontSize = "10px";
    dragImage.style.fontWeight = "bold";
    dragImage.style.border = "2px solid #222";
    dragImage.style.boxSizing = "border-box";
    dragImage.style.borderRadius = tokenShape === "circle" ? "50%" : "8px"; // Use the current shape

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
        [id]: { ...prevTokens[id], top: newTop, left: newLeft },
      };
      localStorage.setItem("tokenPositions", JSON.stringify(newTokens));
      return newTokens;
    });

    // Send move to server
    if (socket && roomId) {
      socket.send(JSON.stringify({
        type: "move-token",
        roomId,
        tokenId: id,
        position: { left: newLeft, top: newTop }
      }));
    }
  };

  const triggerJoinTable = () => {
    setShowJoinTable(true);
  };

  const handleJoinTable = () => {
    if (socket) {
      socket.send(JSON.stringify({
      type: 'join-room',
      roomId: joinRoomCode,
      user: { id: myId, name: myName }
    }));
  setRoomId(joinRoomCode);
  setShowJoinTable(false);
  setJoinRoomCode("");
  };
}


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
          {Object.entries(tokens).map(([id, token]) => (
            <div
              key={id}
              className={`token ${id === myId ? "pc" : ""} ${tokenShape}`}
              style={{
                top: `${token.top}px`,
                left: `${token.left}px`,
                backgroundColor: token.color || tokenColor,
                borderRadius: token.shape === "circle" ? "50%" : "8px",
                position: "absolute"
              }}
              draggable={id === myId} // Only allow dragging for the player's own token
              onDragStart={id === myId ? e => handleDragStart(id, e) : undefined}
            >
              {token.label}
            </div>
          ))}
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
                <label>Enter Your Name</label>
                <input
                  type="text"
                  value={myName}
                  onChange={e => setMyName(e.target.value)}
                  maxLength={16}
                />
                <label>Enter Table ID</label>
                <input 
                  type="text"
                  value={joinRoomCode}
                  onChange={e => setJoinRoomCode(e.target.value)}
                />
                <button
                  type="button"
                  className="close-join-button"
                  onClick={handleJoinTable}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showCustomizeModal && (
          <div className="join-table-overlay" onClick={() => setShowCustomizeModal(false)}>
            <div className="customize-token-modal" onClick={e => e.stopPropagation()}>
              <div className="form-group">
                <div className="customize-token-row">
                  {/* Left: Color Picker */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Token Color</label>
                    <input
                      type="color"
                      value={tokenColor}
                      onChange={e => setTokenColor(e.target.value)}
                      style={{ width: "60px", height: "40px", border: "none", background: "none" }}
                    />
                  </div>
                  {/* Right: Shape and Label */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Token Label</label>
                    <input
                      type="text"
                      value={tokenLabel}
                      onChange={e => setTokenLabel(e.target.value)}
                      maxLength={2}
                    />
                    <label>Shape</label>
                    <div style={{ display: "flex", gap: "1em", justifyContent: "center", marginBottom: "0.4em" }}>
                      <button
                        type="button"
                        className={`shape-select-button${tokenShape === "circle" ? " selected" : ""}`}
                        onClick={() => setTokenShape("circle")}
                      >
                        Circle
                      </button>
                      <button
                        type="button"
                        className={`shape-select-button${tokenShape === "square" ? " selected" : ""}`}
                        onClick={() => setTokenShape("square")}
                      >
                        Square
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="close-join-button"
                  onClick={() => setShowCustomizeModal(false)}
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