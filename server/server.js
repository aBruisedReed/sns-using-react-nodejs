const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const api = require('./routes/api');
const auth = require('./routes/auth');
const cors = require('cors');
const sessionConfig = require('./config/session');
const passportConfig = require('./config/passport');
const socket = require('./module/socket');
const morgan = require('morgan');
require('dotenv').config({ path: `${__dirname}/../../.env` });

// configs
sessionConfig(app);
passportConfig(app);

// middleware 
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));
app.use(express.json());
app.use(morgan('dev'));

// module
socket(server);

// route
app.use('/api', api);
app.use('/auth', auth);

// app은 서버를 시작하며 3002 포트 연결을 listening
const port = 3002;
server.listen(port, () => {
  console.log(`express is running on ${port}`)
});

