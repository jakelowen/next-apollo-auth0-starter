const data = require('./connectors').data;

const resolvers = {
  Query: {
    posts: (obj, args, context, info) => {
      return data.loadAllPosts()
    },
    author: (_, { id }) => data.author.load(id),
    post: (_, { id }) => data.post.load(id),
    me: (obj, args, context, info) => {
      const isAuthorized = context.user.sub !== undefined
      return Object.assign({}, context.user, {
        id: context.user.sub,
        isAuthorized
      })
    },
  },
  Mutation: {
    upvotePost: (_, { postId }) => data.incrementPostVotes(postId)
  },
  Author: {
    posts: (author) => data.loadAllPostsByAuthor(author.id),
  },
  Post: {
    author: (post) => data.author.load(post.authorId),
  },
};

exports.resolvers = resolvers;
