var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send({ greeting: 'Hello React Node.js', ps: 'data from node.js' });
});

router.post('/write', function(req, res, next) {
  res.send('post complete');
  console.log(req.body);
});

module.exports = router;
