
const DataLoader = require('dataloader');
const pg = require('pg');
pg.defaults.ssl = true;
const dev = process.env.NODE_ENV !== 'production'

var config = {}
if (dev) {
  config = require('../config/env/dev.json')
} else  {
  config = require('../config/env/prod.json')
}

const db = require('knex')({
  client: 'pg',
  connection: config.HEROKU_PG_URL,
  searchPath: 'knex,public'
});

// The list of data loaders

const data = {
  author: new DataLoader(ids => db.table('authors')
    .whereIn('id', ids).select()
    .then(rows => ids.map(id => rows.find(x => x.id === id)))),

  post: new DataLoader(ids => db.table('posts')
    .whereIn('id', ids).select()
    .then(rows => ids.map(id => rows.find(x => x.id === id)))),

  loadAllPosts: () => db.table('posts').select(),
  loadAllPostsByAuthor: (authorId) => db.table('posts').where({authorId: authorId}).select(),
  incrementPostVotes: (postId) => db.table('posts').where({id: postId}).returning('*')
    .update({
      'votes': db.raw('votes + 1')
    })
    .then(rows => rows[0]),
};

exports.data = data;
