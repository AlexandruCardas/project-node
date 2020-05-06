import axios from 'axios';
import xml2js from 'xml2js';
import debug from 'debug';

const parser = new xml2js.Parser({ explicitArray: false });

export default function goodreadsService() {
  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/book/isbn/${id}?key=SyHthQYrZhEfFg9x1ubYQ`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((e) => {
          reject(e);
          debug(e);
        });
    });
  }

  return { getBookById };
}

