const express = require('express');
const app = express();
const api = require('./routes/index');
const cors = require('cors');

// cors 모듈로 cors 문제 해결
app.use(cors());

// body-parser 사용 
app.use(express.json());

// /api 연결에 대해 api(index.js)로 연결
app.use('/api', api);

// app은 서버를 시작하며 3002 포트 연결을 listening
const port = 3002;
app.listen(port, () => {
  console.log(`express is running on ${port}`)
});
