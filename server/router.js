const express = require('express');
const toAsyncRouter = require('async-express-decorator');
const validator = require('validator');

const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

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

const router = toAsyncRouter(express.Router());

router.get('/:short', async (req, res) => {
  const { short } = req.params;
  if (short == '404' && process.env.NODE_ENV == 'development') return res.redirect('404.html');
  // look short in firebase up
  const s = await findShort(short);
  if (!s || !s.long) return res.redirect('404');
  res.redirect(`${s.long.startsWith('http') ? '' : 'https://'}${s.long}`);
});

router.post('/url', async (req, res) => {
  const long = req.body.long;
  let short = req.body.short;
  if (!long) return res.status(400).send({ message: 'Missing long url.' });
  if (!validator.isURL(long)) return res.status(400).send({ message: 'Long should be an url.' });
  if (!short) short = nanoid();
  if (!validator.isAlphanumeric(short)) return res.status(400).send({ message: 'Short url should alphanumeric.' });
  if (short.length < 3) return res.status(400).send({ message: 'Short url should be at least 3 characters long.' });
  //  check short doesn't exist
  short = short.toLowerCase();
  const s = await findShort(short);
  if (s) return res.status(400).send({ message: 'Short url is already in use.' });

  // save in db
  await db.ref('/').push({ short, long });

  res.status(200).send({ short, long });
});

async function findShort(url) {
  const data = await db.ref('/').once('value');
  const val = data.val();
  return Object.values(val || {}).find(({ short }) => short == url);
}

module.exports = router;
