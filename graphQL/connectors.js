
const DataLoader = require('dataloader');
const pg = require('pg');
pg.defaults.ssl = true;
const dev = process.env.NODE_ENV !== 'production'

if (dev) {
  console.log("DEV MODE!")
  require('dotenv').config({path: '.env.dev'})
}

const db = require('knex')({
  client: 'pg',
  connection: process.env.HEROKU_PG_URL,
  searchPath: 'knex,public'
});

// The list of data loaders


exports.authorLoader = new DataLoader(ids => db.table('authors')
    .whereIn('id', ids).select()
    .then(rows => ids.map(id => rows.find(x => x.id === id))))

exports.postLoader = new DataLoader(ids => db.table('posts')
    .whereIn('id', ids).select()
    .then(rows => ids.map(id => rows.find(x => x.id === id))))

exports.postVotesLoader = new DataLoader(ids => db.table('post_votes')
    .countDistinct('voter_id as vote_count') 
    .whereIn('post_id', ids)
    .groupBy('post_id')
    .select('post_id')
    .then(rows => ids.map(id => {
      let row = rows.find(x => x.post_id === id)
      if (row === undefined) {
        // coerce count to 0 if row doesn't exist in results
        return {post_id: id, vote_count: 0}
      } else {
        return {post_id: id, vote_count: parseInt(row.vote_count, 10)}
      }
    })))

exports.loadAllPosts = () => db.table('posts').select()

// TODO convert to data loader!
exports.loadAllPostsByAuthor = (authorId) => db.table('posts').where({authorId: authorId}).select()

exports.upvotePost = (postId, voterId) => db.table('post_votes')
    .insert({
      'voter_id': voterId,
      'post_id': postId
    })
    .then(_ => exports.postVotesLoader.clear(postId))
    .then(_ => exports.postLoader.clear(postId))
    .then(_ => exports.postLoader.load(postId))

