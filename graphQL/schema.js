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
  type PostVote {
    postId: Int!
    voterId: String!
  }
  # this schema allows the following mutation:
  type Mutation {
    upvotePost (input: upvotePostInput!): Post!
  }
  # inputs
  input upvotePostInput {
    postId: Int!
    voterId: String!
  }
  # hacking on subscriptions - no idea what I'm doing here
  type Subscription {
    voteAdded(postId: Int!): PostVote
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

exports.schema = schema;