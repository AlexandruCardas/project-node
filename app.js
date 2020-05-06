import chalk from 'chalk'
import express from 'express'
import debug from 'debug'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

let __dirname = path.resolve()

const app = express()
const port = process.env.PORT || 3000

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' },
]

app.use(morgan('tiny')) // Or combined, is also a middleware.
app.use(bodyParser.json()) // This is waiting for a next() to be executed (its a middleware).
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ secret: 'library' }))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/css',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/js',
  express.static(path.join(__dirname, '/node_modules/jquery/dist')))
app.use('/js',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')))
app.use('/js',
  express.static(path.join(__dirname, '/node_modules/popper.js/dist/umd')))

app.set('views', './src/views') // res.render will look in this folder.
app.set('view engine', 'ejs')

import bookRouter from './src/routes/bookRoutes.js'
import adminRouter from './src/routes/adminRoutes.js'
import authRouter from './src/routes/authRoutes.js'

app.use('/books', bookRouter)
app.use('/admin', adminRouter)
app.use('/auth', authRouter)

// The .get requires a callback function
app.get('/', (request, response) => {
  // response.send("Hello from my library app");
  // response.sendFile(path.join(__dirname, 'views', 'index.ejs'));
  response.render('index',
    {
      nav:
        [
          { link: '/books', title: 'Books' },
          { link: '/authors', title: 'Authors' },
        ],
      title: 'Library',
    })
})

app.listen(port, () => {
  debug(`listening at on port ${chalk.green(port)}`)
})
