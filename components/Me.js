import { gql, graphql } from 'react-apollo'

function PostList ({ data: { loading, error, me} }) {
  if (error) return <p>'Error loading me.' </p>
  if (me) {
    
    return (
      <section>
        <h3>Auth Details</h3>
        <pre>
          {JSON.stringify(me, null, '\t')}
        </pre>
        <style jsx>{`
          pre {
            font-size: 12px;
            text-align: left;
          }
          
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

const allPosts = gql`
query {
  me {
    id
    email
    name
    picture
    isAuthorized
  }
}
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPosts)(PostList)