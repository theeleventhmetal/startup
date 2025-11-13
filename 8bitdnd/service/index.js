const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
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

// Add this after your other app.use() statements
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});