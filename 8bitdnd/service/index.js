const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const authCookieName = 'token';

// Import database functions
const {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addCharacter,
  updateCharacter,
  getCharacter
} = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startup.8bitdnd.click');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});


// Enhanced verifyAuth with debugging
const verifyAuth = async (req, res, next) => {
  console.log('🔍 Checking authentication...');
  console.log('Cookies received:', req.cookies);
  
  const token = req.cookies[authCookieName];
  console.log('Auth token:', token);
  
  const user = await findUser('token', token);
  console.log('User found:', user ? user.email : 'None');
  
  if (user) {
    console.log('✅ Authentication successful');
    next();
  } else {
    console.log('❌ Authentication failed');
    res.status(401).send({ msg: 'Unauthorized' });
  }
};
// Update character endpoints
apiRouter.get('/charactercard', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  
  if (user) {
    const characterData = await getCharacter(user.email);
    console.log('Sending character data:', characterData);
    res.json(characterData);
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.post('/charactercard', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  
  if (user) {
    await updateCharacter(user.email, req.body);
    res.json({ msg: 'Character saved successfully', character: req.body });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Update your existing functions
async function findUser(by, value) {
  if (by === 'email') {
    return await getUser(value);
  } else if (by === 'token') {
    return await getUserByToken(value);
  }
  return null;
}

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    email: email,
    password: hashedPassword,
    token: uuid.v4(),
    createdAt: new Date()
  };
  
  await addUser(user);
  return user;
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false, // Change to false for development (HTTP)
    httpOnly: true,
    sameSite: 'strict',
  });
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = {}; // { roomId: { participants: [{id, name, isGM, ws}], gm: ws, tokens: {} } }

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      return;
    }

    // Handle create-room
    if (msg.type === 'create-room') {
      rooms[msg.roomId] = { participants: [], gm: ws, tokens: {} };
      ws.roomId = msg.roomId;
      ws.isGM = true;
      ws.send(JSON.stringify({ type: 'room-created', roomId: msg.roomId }));
      ws.send(JSON.stringify({ type: 'room-state', participants: [], tokens: {} }));
    }

    // Handle join-room
    if (msg.type === 'join-room') {
      const room = rooms[msg.roomId];
      if (room) {
        const user = { id: msg.user.id, name: msg.user.name, isGM: false };
        room.participants.push({ ...user, ws });
        ws.roomId = msg.roomId;
        ws.userId = msg.user.id;
        // Create a token for this user if not present
        if (!room.tokens[msg.user.id]) {
          room.tokens[msg.user.id] = {
            top: 50,
            left: 50,
            label: msg.user.name?.slice(0,2).toUpperCase() || "PC",
            color: "#1E90FF",
            shape: "circle"
          };
        }
        // Notify all in room
        broadcastToRoom(msg.roomId, {
          type: 'participant-joined',
          user,
        });
        // Send updated participant list and tokens
        broadcastToRoom(msg.roomId, {
          type: 'room-state',
          participants: room.participants.map(p => ({
            id: p.id,
            name: p.name,
            isGM: p.isGM
          })),
          tokens: room.tokens
        });
      } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
      }
    }

    // Handle move-token
    if (msg.type === "move-token") {
      const room = rooms[msg.roomId];
      if (room && room.tokens && room.tokens[msg.tokenId]) {
        room.tokens[msg.tokenId] = {
          ...room.tokens[msg.tokenId],
          ...msg.position
        };
        // Broadcast the updated token position
        broadcastToRoom(msg.roomId, {
          type: "token-moved",
          tokenId: msg.tokenId,
          position: msg.position
        });
        // Optionally, broadcast all tokens for full sync
        broadcastToRoom(msg.roomId, {
          type: "tokens-updated",
          tokens: room.tokens
        });
      }
    }

    // Handle add-tokens (from GM)
    if (msg.type === "add-tokens") {
      const room = rooms[msg.roomId];
      if (room) {
        // Add each new token to the room's tokens
        Object.entries(msg.tokens).forEach(([id, token]) => {
          room.tokens[id] = token;
        });
        // Broadcast to all in the room
        broadcastToRoom(msg.roomId, {
          type: "add-tokens",
          tokens: msg.tokens
        });
        // Optionally, broadcast all tokens for full sync
        broadcastToRoom(msg.roomId, {
          type: "tokens-updated",
          tokens: room.tokens
        });
      }
    }

    // Handle upload-map (from GM)
    if (msg.type === "upload-map") {
      const room = rooms[msg.roomId];
      if (room) {
        // Store the map data in the room
        room.map = msg.mapData;
        // Broadcast the new map to all clients in the room
        broadcastToRoom(msg.roomId, {
          type: "map-updated",
          mapData: msg.mapData
        });
      }
    }
  });

  ws.on('close', () => {
    // Remove from room participants and tokens
    if (ws.roomId && rooms[ws.roomId]) {
      const room = rooms[ws.roomId];
      room.participants = room.participants.filter(p => p.ws !== ws);
      // Remove token for this user
      if (ws.userId && room.tokens && room.tokens[ws.userId]) {
        delete room.tokens[ws.userId];
        broadcastToRoom(ws.roomId, {
          type: "tokens-updated",
          tokens: room.tokens
        });
      }
      // Notify others
      broadcastToRoom(ws.roomId, {
        type: 'participant-left',
        userId: ws.userId
      });
    }
  });
});

// Helper to broadcast to all in a room (including GM)
function broadcastToRoom(roomId, message) {
  const room = rooms[roomId];
  if (!room) return;
  // Send to GM
  if (room.gm && room.gm.readyState === WebSocket.OPEN) {
    room.gm.send(JSON.stringify(message));
  }
  // Send to participants
  room.participants.forEach(p => {
    if (p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(JSON.stringify(message));
    }
  });
}

// Start HTTP & WebSocket server
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});