import Post from '../components/Post'
import securePage from '../hocs/securePage'
import withData from '../lib/withData'

const Content = (props) => (
  <div>
    <h1>Post Details</h1>
    <p>This is the blog post content.</p>
    <Post postId={props.url.query.postId}/>
  </div>
)

export default securePage(withData(Content))