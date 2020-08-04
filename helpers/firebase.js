const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

async function findShort(url = '') {
  const data = await db.ref('/').once('value');
  const val = data.val();
  return Object.values(val || {}).find(({ short }) => short == url);
}

async function saveDB(short = '', long = '') {
  return db.ref('/').push({ short, long });
}

module.exports = { findShort, saveDB };
