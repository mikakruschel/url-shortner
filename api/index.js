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
  const { short } = req.query;
  console.log(`short: ${short}`);
  // if (short == '404' && process.env.NODE_ENV == 'development') return res.redirect('404.html');
  // look short in firebase up
  let s;
  try {
    s = await findShort(short);
  } catch (e) {
    console.log(e);
  }

  if (!s || !s.long) {
    res.writeHead(301, { Location: '/404' });
    res.end();
    return;
  }

  res.writeHead(301, { Location: `${s.long.startsWith('http') ? '' : 'https://'}${s.long}` });
  res.end();

  // // res.writeHead(302, {
  // //   Location: `${s.long.startsWith('http') ? '' : 'https://'}${s.long}`,
  // // });
  // res.send('redirect: ' + `${s.long.startsWith('http') ? '' : 'https://'}${s.long}`);
};

async function findShort(url = '') {
  const data = await db.ref('/').once('value');
  const val = data.val();
  return Object.values(val || {}).find(({ short }) => short == url);
}

// app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);
//
// module.exports = app;
