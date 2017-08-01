const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const resolvers = require('./resolvers').resolvers;

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
  type User {
    id: String!
    email: String
    name: String
    picture: String
    isAuthorized: Boolean
  }
  # the schema allows the following query:
  type Query {
    posts: [Post]
    post(id: Int!): Post
    author(id: Int!): Author
    me: User
  }
  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

exports.schema = schema;