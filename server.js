const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const graphqlExpress = require('apollo-server-express').graphqlExpress;
const schema = require('./graphQL/schema').schema;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = 3000;
const authConfig = require('./config/authConfig.json')

var corsOptions = {
  origin: 'http://localhost:3000', // dont know what to set here.
  credentials: true // <-- REQUIRED backend setting
};


app.prepare()
.then(() => {
  const server = express()

  // for auth
  server.use(cors(corsOptions));
  server.use(cookieParser());

  // Graphql
  // server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  server.use('/graphql', bodyParser.json(), graphqlExpress(request => {
    let options = {
      schema,
      context: {user: null}
    }

    if (request.cookies.jwt) {
      options.context.user = jwt.verify(request.cookies.jwt, authConfig.AUTH0_SECRET);
    }

    return options
  }));

  // Next.js custom server routes
  server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { postId: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  // Next.js core
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})