var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send({ greeting: 'Hello React Node.js', ps: 'data from node.js' });
});

module.exports = router;
