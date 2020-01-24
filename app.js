const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny')); // Or combined
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// The .get requires a callback function
app.get('/', (request, response) => {
  // response.send("Hello from my library app");
  response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  debug(`listening at on port ${chalk.green('3000')}`);
});
