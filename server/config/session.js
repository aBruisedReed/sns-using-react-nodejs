const session = require('express-session');
require('dotenv').config({ path: `${__dirname}/../.env` });

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: false,
      saveUninitialized: true,
    })
  );
};

