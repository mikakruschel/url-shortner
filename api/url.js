require('dotenv').config();

const validator = require('validator');

const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

const { findShort, saveDB } = require('../helpers/firebase');

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
  await saveDB(short, long);

  res.status(200).json({ short, long });
};
