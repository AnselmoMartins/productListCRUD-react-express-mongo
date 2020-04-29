const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  'mongodb://localhost:1111/nodeapi',
  { useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);
requireDir('./src/models');

app.use('/api', require('./src/routes'));

app.use((err, req, res, next) => {
  res.status(500);
  res.render('error', { error: err });
})

app.listen(3001);

