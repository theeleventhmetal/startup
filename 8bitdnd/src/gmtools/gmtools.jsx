import './gmtools.css';
import React, { useState, useEffect } from 'react';

export function Gmtools() {
  const PLACEHOLDER_MAP = "../../public/battlemaps/battlemap_placeholder.jpg"; 
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showMapUpload, setShowMapUpload] = useState(false);
  const [mapImage, setMapImage] = useState(PLACEHOLDER_MAP);
  const [gameStarted, setGameStarted] = useState(false);
  const [tokens, setTokens] = useState({});
  const [tokenColor, setTokenColor] = useState("#1E90FF");
  const [tokenLabel, setTokenLabel] = useState("");
  const [tokenShape, setTokenShape] = useState("circle");
  const [numTokens, setNumTokens] = useState(1);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'participant-joined') {
        setParticipants(prev => [...prev, message.user]);
      }
      
      if (message.type === 'participant-left') {
        setParticipants(prev => 
          prev.filter(p => p.id !== message.userId)
        );
      }
      
      if (message.type === 'room-state') {
        setParticipants(message.participants);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'participant-joined') {
        setParticipants(prev => [...prev, message.user]);
      }

      if (message.type === 'participant-left') {
        setParticipants(prev => prev.filter(p => p.id !== message.userId));
      }

      if (message.type === 'room-state') {
        setParticipants(message.participants);
        if (message.tokens) setTokens(message.tokens);
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

      if (message.type === "add-tokens") {
        setTokens(prev => ({ ...prev, ...message.tokens }));
      }
      if (message.type === "tokens-updated") {
        setTokens(message.tokens);
      }
    };
  }, [socket]);

  useEffect(() => {
    setTokens(tokens => {
      const newTokens = { ...tokens };
      participants.forEach(p => {
        if (!newTokens[p.id]) {
          newTokens[p.id] = { top: 50, left: 50, label: p.name?.slice(0,2).toUpperCase() || "PC", color: "#1E90FF", shape: "circle" };
        }
      });
      return newTokens;
    });
  }, [participants]);

  const createRoom = () => {
    if (socket) {
      const newRoomId = generateRoomCode();
      setRoomId(newRoomId);
      socket.send(JSON.stringify({
        type: 'create-room',
        roomId: newRoomId
      }));
    }
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const mapRect = e.currentTarget.getBoundingClientRect();
    // Get the token element to measure its size
    const tokenElem = document.querySelector(`[data-token-id="${id}"]`);
    const tokenWidth = tokenElem ? tokenElem.offsetWidth : 30;
    const tokenHeight = tokenElem ? tokenElem.offsetHeight : 30;
    const newLeft = e.clientX - mapRect.left - tokenWidth / 2;
    const newTop = e.clientY - mapRect.top - tokenHeight / 2;
  
    setTokens(prev => ({
      ...prev,
      [id]: { ...prev[id], left: newLeft, top: newTop }
    }));
  
    // Broadcast to server
    if (socket && roomId) {
      socket.send(JSON.stringify({
        type: "move-token",
        roomId,
        tokenId: id,
        position: { left: newLeft, top: newTop }
      }));
    }
  };

  const handleDragStart = (id, e) => {
    e.dataTransfer.setData("text/plain", id);
  };

  // Add tokens handler
  const handleAddTokens = () => {
    const newTokens = {};
    for (let i = 0; i < numTokens; i++) {
      const id = `gm-token-${Date.now()}-${i}`;
      newTokens[id] = {
        top: 50 + i * 10,
        left: 50 + i * 10,
        label: tokenLabel || `T${i + 1}`,
        color: tokenColor,
        shape: tokenShape,
      };
    }
    setTokens(prev => ({ ...prev, ...newTokens }));

    // Broadcast to server
    if (socket && roomId) {
      console.log("adding tokens")
      socket.send(JSON.stringify({
        type: "add-tokens",
        roomId,
        tokens: newTokens,
      }));
    }

    setShowCustomizeModal(false);
  };

  return (
    <main>
      <div className="landscape-warning">
        For best experience, please rotate your device to landscape mode.
      </div>

      {!gameStarted ? (
        <>
          <div className="row">
            <div className="host-content">
              <div className="game-id-box">
                {roomId ? (
                  <div>
                    <h3> Table ID:</h3>
                    <h1 className="room-code">{roomId}</h1>
                    <p>Share this code with your players</p>
                  </div>
                ) : (
                  <div>
                    <h2> No Table ID yet</h2>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="host-table-button"
                onClick={createRoom}
              >
                {roomId ? "Create New Table ID" : "Host Table"}
              </button>
            </div>

            <div className="participants-box">
              <div className="participants-header">
                Players At Table ({participants.length})
              </div>
              {participants.length === 0 ? (
                <div className="no-participants">
                  <div className="waiting-message">
                    <span>Waiting for players to join...</span>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="participants-list">
                  {participants.map(participant => (
                    <div key={participant.id} className="participant-item">
                      <div className="participant-info">
                        <span className="participant-name">{participant.name}</span>
                      </div>
                      <div className={`participant-indicator ${participant.isGM ? 'gm' : 'online'}`}></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {roomId && !gameStarted && (
              <button
                className="host-table-button"
                onClick={() => setGameStarted(true)}
              >
                Start Game
              </button>
            )}
        </>
      ) : (
        <div className = "gm-tabletop">
          <div 
            className="gm-map"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            
              <img
                src={mapImage}
                alt="Map"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "center"
                }}
              />


            {/* Render all tokens */}
            {Object.entries(tokens).map(([id, token]) => (
              <div
                key={id}
                className={`token ${token.shape || "circle"}`}
                style={{
                  top: `${token.top}px`,
                  left: `${token.left}px`,
                  backgroundColor: token.color || "#1E90FF",
                  borderRadius: token.shape === "circle" ? "50%" : "8px",
                  position: "absolute"
                }}
                draggable
                onDragStart={e => handleDragStart(id, e)}
                data-token-id={id}
                onContextMenu={e => {
                  e.preventDefault();
                  // Simple confirm dialog, or replace with a custom modal if you want
                  if (window.confirm("Delete this token?")) {
                    setTokens(prev => {
                      const copy = { ...prev };
                      delete copy[id];
                      return copy;
                    });
                  }
                }}
              >
                {token.label}
              </div>
            ))}
          </div>

          <div className="right-gm-screen">

            <div className="participants-final">
              <div className="participants-header">
                Players At Table ({participants.length})
              </div>
              {participants.length === 0 ? (
                <div className="no-participants">
                  <div className="waiting-message">
                    <span>Waiting for players to join...</span>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="participants-list">
                  {participants.map(participant => (
                    <div key={participant.id} className="participant-item">
                      <div className="participant-info">
                        <span className="participant-name">{participant.name}</span>
                      </div>
                      <div className={`participant-indicator ${participant.isGM ? 'gm' : 'online'}`}></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bottom-gm-buttons">

              <button 
              className="add-tokens-button"
              onClick={() => setShowCustomizeModal(true)}
              >
                Add Tokens
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
                    <label>Number of Tokens</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={numTokens}
                      onChange={e => setNumTokens(Number(e.target.value))}
                      style={{ width: "60px", height: "40px", border: "1px solid #ccc", background: "none" }}
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
                  onClick={handleAddTokens}
                >
                  Add {numTokens} Token{numTokens > 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  )
}