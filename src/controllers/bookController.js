const { MongoClient, ObjectID } = require('mongodb'); // Destructure it.
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  function getIndex(req, res) {
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
  }

  function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://172.17.0.2:27017/LibraryApp?authSource=admin';
    const dbName = 'LibraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        const col = await db.collection('books');

        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView', {
          nav,
          title: 'Library',
          book
        });
      } catch (e) {
        debug(e.stack);
      }
    }());
  }

  function middleware(req, res, next) {
    // if (req.user) {
    next();
    // } else {
    //   res.redirect('/');
    // }
  }

  // Reveal pattern.
  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookController;
