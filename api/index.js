const { findShort } = require('../helpers/firebase');

module.exports = async (req, res) => {
  const { short } = req.query;
  console.log(`short: ${short}`);
  // look short in firebase up
  const s = await findShort(short);

  if (!s || !s.long) {
    res.writeHead(301, { Location: '/404' });
    res.end();
    return;
  }

  res.writeHead(301, { Location: `${s.long.startsWith('http') ? '' : 'https://'}${s.long}` });
  res.end();
};
