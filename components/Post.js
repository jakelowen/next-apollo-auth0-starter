import { gql, graphql } from 'react-apollo'
import { compose } from 'react-apollo';

const Post = ({postQuery, upVotePostMutation}) => {

  const onClick = () => {
    upVotePostMutation({
      variables: { postId: postQuery.post.id}
    })
      .then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  if (postQuery.error) return <p>'Error loading posts.' </p>
  if (postQuery.post) {
    
    return (
      <section>
        <p>
          <strong>Title:</strong> {postQuery.post.title}<br />
          <strong>Vote:</strong> {postQuery.post.votes}<br />
          <strong>Author:</strong> {postQuery.post.author.firstName} {postQuery.post.author.lastName}
        </p>
    
        <button onClick={onClick}>Upvote!</button>
        <style jsx>{`
          section {
            padding-bottom: 20px;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

const postQuery = gql`
query($postId: Int!) {
  post(id: $postId) {
    id
    title
    votes
    author {
      firstName
      lastName
    }
  }
}
`

const upVotePostMutation = gql`
  mutation($postId: Int!) {
  upvotePost(postId: $postId) {
    id
    votes
  }
}
`;

// cool! "By default, graphql will attempt to pick up any missing variables from the query from ownProps."
// export default graphql(postQuery)(Post)

export default compose(
  graphql(postQuery, { name: 'postQuery' }),
  graphql(upVotePostMutation, { name: 'upVotePostMutation' })
)(Post)