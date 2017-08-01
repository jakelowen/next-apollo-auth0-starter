import React from 'react'
import PropTypes from 'prop-types';
import PostList from '../components/PostList'
import withData from '../lib/withData'

import securePage from '../hocs/securePage'

const Secret = ({ loggedUser }) => (
  <div>
    <p>
      Hi {loggedUser.email}. This is a super secure page! Try loading this page again using the incognito/private mode of your browser.
    </p>
    <h3>Here's some posts</h3>
      <PostList />

    <style jsx>{`
      p {
        font-size: 20px;
        font-weight: 200;
        line-height: 30px;
      }

      h3 {
        margin-top: 20px;
        margin-bottom: 10px;
      }
    `}</style>
  </div>
)

Secret.propTypes = {
  loggedUser: PropTypes.object.isRequired
}

export default securePage(withData(Secret))