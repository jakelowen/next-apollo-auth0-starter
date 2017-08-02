const connectors = require('./connectors');
const { withFilter } = require('graphql-subscriptions')
const { RedisPubSub } = require('graphql-redis-subscriptions')

const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  console.log("DEV MODE!")
  require('dotenv').config({path: '.env.dev'})
}

const redisConnectionListener = (err) => {
  if (err) console.error(err); // eslint-disable-line no-console
  console.info('Succesfully connected to redis'); // eslint-disable-line no-console
};

// Docs on the different redis options
// https://github.com/NodeRedis/node_redis#options-object-properties
const redisOptions = {
  host: process.env.REDIS_PUBSUB_HOST,
  user: process.env.REDIS_PUBSUB_USER,
  port: process.env.REDIS_PUBSUB_PORT,
  password: process.env.REDIS_PUBSUB_PASSWORD,
  connect_timeout: 15000,
  enable_offline_queue: true,
  retry_unfulfilled_commands: true,
};

const pubsub = new RedisPubSub({
  connection: redisOptions,
  connectionListener: redisConnectionListener,
});

const resolvers = {
  Query: {
    posts: (obj, args, context, info) => {
      return connectors.loadAllPosts()
    },
    author: (_, { id }) => connectors.authorLoader.load(id),
    post: (_, { id }) => connectors.postLoader.load(id),
    me: (obj, args, context, info) => {
      const isAuthorized = context.user.sub !== undefined
      return Object.assign({}, context.user, {
        id: context.user.sub,
        isAuthorized
      })
    },
  },
  Mutation: {
    upvotePost: (_, { input }) => {

      pubsub.publish('voteAdded', {
        voteAdded: {
          voterId: input.voterId,
          postId: input.postId
        }
      })

      return connectors.upvotePost(input.postId, input.voterId)
    }
  },
  Author: {
    posts: (author) => connectors.loadAllPostsByAuthor(author.id),
  },
  Post: {
    author: (post) => connectors.authorLoader.load(post.authorId),
    votes: (post) => connectors.postVotesLoader.load(post.id)
      .then(results => results.vote_count)
  },
  Subscription: {
    voteAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('voteAdded'),
        (payload, variables) => {
          console.log('variables', variables)
          console.log('payload', payload)
          return payload.voteAdded.postId === variables.postId
        }
      )
    }
  }
};

exports.resolvers = resolvers;
