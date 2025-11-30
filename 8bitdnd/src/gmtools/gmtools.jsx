import './gmtools.css';
import React, { useState, useEffect } from 'react';

export function Gmtools() {
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
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

  return (
    <main>
      <div className="landscape-warning">
        For best experience, please rotate your device to landscape mode.
      </div>

      <div className="row">
        <div className="host-content">
        <div className="game-id-box">
          {roomId ? (
            <div>
            <h3> Table ID:</h3>
            <h1 className="room-code">{roomId}</h1>
            <p>Share this code with your players</p>
            </div>
          ): (
            <div>
            <h2> No Table ID yet</h2>
            </div>
          )}
        </div>
        <button
        type="button"
        className="host-table-button"
        onClick = {createRoom}
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
                  <div className="participant-avatar">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="participant-info">
                    <span className="participant-name">{participant.name}</span>
                    <span className="participant-status">
                      {participant.isGM ? 'Game Master' : 'Player'}
                    </span>
                  </div>
                  <div className={`participant-indicator ${participant.isGM ? 'gm' : 'online'}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      

    </main>
  )
}