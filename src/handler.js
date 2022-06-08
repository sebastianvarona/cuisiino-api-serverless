const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.get('/check', (req, res) => {
  res.status(200).json({ msg: 'Success' });
});

app.use('/', require('./routes/router'));

app.use((req, res, next) => {
  return res.status(404).json({
    err: 'Not Found',
  });
});

module.exports.handler = serverless(app);
