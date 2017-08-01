import { gql, graphql } from 'react-apollo'
import Link from 'next/link'

const POSTS_PER_PAGE = 10

function PostList ({ data: { loading, error, posts} }) {
  if (error) return <p>'Error loading posts.' </p>
  if (posts) {
    
    return (
      <section>
        <ul>
          {posts.map((post, index) =>
            <li key={post.id}>
              <Link >
                <a href={`/p/${post.id}`}>{post.title}</a>
              </Link>
            </li>
          )}
        </ul>
    
        <style jsx>{`
          section {
            padding-bottom: 20px;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          button:before {
            align-self: center;
            border-style: solid;
            border-width: 6px 4px 0 4px;
            border-color: #ffffff transparent transparent transparent;
            content: "";
            height: 0;
            margin-right: 5px;
            width: 0;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

const allPosts = gql`
query {
  posts {
    id
    title
  }
}
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPosts)(PostList)