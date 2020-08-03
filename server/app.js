const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const secure = require('ssl-express-www');

require('dotenv').config();

const middlewares = require('./middlewares');
const router = require('./router');

const app = express();
app.set('trust proxy', 1);

app.use(secure);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(express.static('static'));

app.use('/', router);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
