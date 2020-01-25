const express = require('express');
const { MongoClient, ObjectID } = require('mongodb'); // Destructure it.
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp').post((req, res) => {
    const { username, password } = req.body;
    const url = 'mongodb://172.17.0.2:27017/LibraryApp?authSource=admin';
    const dbName = 'LibraryApp';

    (async function addUser() {
      let client;

      try {
        client = await MongoClient.connect(url);

        debug('Connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('users');
        const user = { username, password };
        const results = await col.insertOne(user);
        debug(results);

        // Create user.
        req.login(results.ops[0], () => {
          res.redirect('/auth/profile');
        }); // TODO logout same as login
      } catch (e) {
        debug(e);
      }
    }());

    debug(req.body);
  });

  authRouter.route('/signIn').get((req, res) => {
    res.render('signIn', {
      nav,
      title: 'signIn'
    });
  }).post(passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/'
  }));

  // This is going to attach the user to the request (Magic).
  authRouter.route('/profile').all((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }).get((req, res) => {
    res.json(req.user);
  });

  return authRouter;
}

module.exports = router;
