const jwt = require('jsonwebtoken');
require('dotenv').config({ path: `${__dirname}/../../.env` });

const authMiddleWare = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token ;

  if(!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in'
    });
  }

  try {
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = authMiddleWare;
