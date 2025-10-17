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
readdirSync('./Routes').map((r) => app.use('/api', require(`./Routes/${r}`)));
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});