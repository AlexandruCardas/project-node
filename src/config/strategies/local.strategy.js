const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');


module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      const url = 'mongodb://172.17.0.2:27017/LibraryApp?authSource=admin';
      const dbName = 'LibraryApp';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url);

          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('users');

          const user = await col.findOne({ username });

          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (e) {
          debug(e.stack);
        }
        await client.close();
      }());
    }
  ));
};
