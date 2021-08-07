const jwt = require('jsonwebtoken');
require('dotenv').config({ path: `${__dirname}/../../.env` });

const authMiddleWare = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token ;
  try {
    if(!token) {
      throw new Error('not logged in');
    }
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
