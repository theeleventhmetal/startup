const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('8bitdnd');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');
const characterCollection = db.collection('character');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to 8bitdnd database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

// User functions
function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  const result = await userCollection.insertOne(user);
  return result;
}

async function updateUser(user) {
  const result = await userCollection.updateOne(
    { email: user.email }, 
    { $set: user }
  );
  return result;
}

// Character functions
async function addCharacter(email, character) {
  const characterData = {
    email: email,
    character: character,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return await characterCollection.insertOne(characterData);
}

async function updateCharacter(email, character) {
  const result = await characterCollection.updateOne(
    { email: email },
    { 
      $set: { 
        character: character,
        updatedAt: new Date()
      } 
    },
    { upsert: true } // Create if doesn't exist
  );
  return result;
}

async function getCharacter(email) {
  const result = await characterCollection.findOne({ email: email });
  return result ? result.character : null;
}

async function deleteCharacter(email) {
  return await characterCollection.deleteOne({ email: email });
}

// Get all characters (for admin/debugging)
async function getAllCharacters() {
  const cursor = characterCollection.find({});
  return cursor.toArray();
}

// Score functions
async function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addCharacter,
  updateCharacter,
  getCharacter,
  deleteCharacter,
  getAllCharacters,
  addScore,
  getHighScores,
};
