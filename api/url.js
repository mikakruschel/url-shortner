// const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const secure = require('ssl-express-www');

require('dotenv').config();

// const apiRouter = require('./api');

// const app = express();
// app.set('trust proxy', 1);

// app.use(secure);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));
// app.use(helmet());
// if (process.env.NODE_ENV == 'development') app.use(express.static('static'));

const validator = require('validator');

const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

const admin = require('firebase-admin');
// const middlewares = require('./middlewares');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

module.exports = async (req, res) => {
  const long = req.body.long;
  let short = req.body.short;
  if (!long) return res.status(400).json({ message: 'Missing long url.' });
  if (!validator.isURL(long)) return res.status(400).json({ message: 'Long should be an url.' });
  if (!short) short = nanoid();
  if (!validator.isAlphanumeric(short)) return res.status(400).json({ message: 'Short url should alphanumeric.' });
  if (short.length < 3) return res.status(400).json({ message: 'Short url should be at least 3 characters long.' });
  //  check short doesn't exist
  short = short.toLowerCase();
  const s = await findShort(short);
  if (s) return res.status(400).json({ message: 'Short url is already in use.' });

  // save in db
  await db.ref('/').push({ short, long });

  res.status(200).json({ short, long });
};

async function findShort(url) {
  const data = await db.ref('/').once('value');
  const val = data.val();
  return Object.values(val || {}).find(({ short }) => short == url);
}

// app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);
//
// module.exports = app;
