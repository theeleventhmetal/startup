const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const authCookieName = 'token';

let users = [];
let userCharacters = {}; // Store character data per user
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

// Get user's character data
apiRouter.get('/charactercard', verifyAuth, async (req, res) => {
  // The user is already verified by middleware, just find them
  const user = await findUser('token', req.cookies[authCookieName]);
  const characterData = userCharacters[user.email] || null;
  
  console.log('User:', user.email);
  console.log('Sending character data:', characterData);
  
  res.json(characterData);
});

// Save user's character data
apiRouter.post('/charactercard', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  
  if (user) {
    userCharacters[user.email] = req.body;
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


//async functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
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