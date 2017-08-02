const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { schema } = require('./graphQL/schema');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('http').createServer;
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = 3000;

if (dev) {
  console.log("DEV MODE!")
  require('dotenv').config({path: '.env.dev'})
}

var corsOptions = {
  // origin: 'http://localhost:3000', // dont know what to set here.
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
      options.context.user = jwt.verify(request.cookies.jwt, process.env.AUTH0_SECRET);
    }

    return options
  }));

  server.use('/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
    })
  )

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

  // websocket server example from here: https://github.com/vannizer/graphql-playground
  // all other tuts seemed to be using depreciated methods with subscriptionManager
  const ws = createServer(server)
  ws.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer(
      { execute, subscribe, schema },
      {
        server: ws,
        path: '/subscriptions'
      }
    )
  })

})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})