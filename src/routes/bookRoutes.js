import express from 'express'
import mongoClient from 'mongodb'; // Destructure it.

import bookController from '../controllers/bookController.js';

const bookRouter = express.Router();
import bookService from '../services/goodreadsService.js'

export default function router(nav) {
  const { getIndex, getById, middleware } = bookController(bookService, nav);
  bookRouter.use(middleware);
  bookRouter.route('/').get(getIndex);

  bookRouter.route('/:id').get(getById);
  return bookRouter;
}
