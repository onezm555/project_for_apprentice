const express = require('express');
const {readdirSync} = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./Config/db');

const app = express();

app.use(morgan('dev'));
app.use(cors());

connectDB();
app.use(bodyParser.json({limit: '10mb'}));
readdirSync('./Routes').map((r) => {
  const routeName = r.replace('.js', '');
  app.use(`/api/${routeName}`, require(`./Routes/${r}`));
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});