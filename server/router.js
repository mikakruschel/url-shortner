const express = require('express');
const toAsyncRouter = require('async-express-decorator');

const router = toAsyncRouter(express.Router());

router.get('/test', (req, res) => {
  res.send('hi');
  // render(req, res, 'pages/index');
});

router.get('/404.png', (req, res) => {
  res.send('404');
  // render(req, res, 'pages/index');
});

module.exports = router;
