const connectors = require('./connectors');

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
    upvotePost: (_, { input }) => connectors.upvotePost(input.postId, input.voterId)
  },
  Author: {
    posts: (author) => connectors.loadAllPostsByAuthor(author.id),
  },
  Post: {
    author: (post) => connectors.authorLoader.load(post.authorId),
    votes: (post) => connectors.postVotesLoader.load(post.id)
      .then(results => results.vote_count)
  },
};

exports.resolvers = resolvers;
