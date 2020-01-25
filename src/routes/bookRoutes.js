const express = require('express');

const bookRouter = express.Router();
const { MongoClient, ObjectID } = require('mongodb'); // Destructure it.
const debug = require('debug')('app:bookRoutes');


function router(nav) {
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  bookRouter.route('/').get((req, res) => {
    const url = 'mongodb://172.17.0.2:27017/LibraryApp?authSource=admin';
    const dbName = 'LibraryApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        const col = await db.collection('books');

        const books = await col.find().toArray();

        res.render('bookListView',
          {
            nav,
            title: 'Library',
            books
          });
      } catch (err) {
        debug(err.stack);
      }
      await client.close();
    }());
  });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://172.17.0.2:27017/LibraryApp?authSource=admin';
      const dbName = 'LibraryApp';

      (async function mong() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('books');

          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);

          res.render('bookView', {
            nav,
            title: 'Library',
            book
          });
        } catch (e) {
          debug(e.stack);
        }
      }());
    });
  return bookRouter;
}

module.exports = router;
