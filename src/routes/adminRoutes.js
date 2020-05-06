import express from 'express'
import debug from 'debug'
import * as mongodb from 'mongodb'

const adminRouter = express.Router();
const books = [
  {
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    bookId: 656,
    read: false
  },
  {
    title: 'Les Misérables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    bookId: 24280,
    read: false
  },
  {
    title: 'The Time Machine',
    genre: 'Science Fiction',
    author: 'H. G. Wells',
    read: false
  },
  {
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    read: false
  },
  {
    title: 'The Dark World',
    genre: 'Fantasy',
    author: 'Henry Kuttner',
    read: false
  },
  {
    title: 'The Wind in the Willows',
    genre: 'Fantasy',
    author: 'Kenneth Grahame',
    read: false
  },
  {
    title: 'Life On The Mississippi',
    genre: 'History',
    author: 'Mark Twain',
    read: false
  },
  {
    title: 'Childhood',
    genre: 'Biography',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  }];

export default function router(nav) {
  adminRouter.route('/').get((req, res) => {
    const url = 'mongodb://172.17.0.2:27017/LibraryApp?authSource=admin';
    const dbName = 'LibraryApp';
    (async function mongo() {
      let client;
      try {
        client = await mongodb.connect(url);
        debug(client);

        const db = client.db(dbName);

        const response = await db.collection('books').insertMany(books);
        res.json(response);
      } catch (err) {
        debug(err.stack);
      }
      await client.close();
    }());
  });

  return adminRouter;
}
