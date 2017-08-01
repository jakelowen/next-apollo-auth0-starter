import React from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link'
import withData from '../lib/withData'
import Me from '../components/Me'

import defaultPage from '../hocs/defaultPage'

const SuperSecretDiv = () => (
  <div>
    <Me />
    <style jsx>{`
      div {
        background-color: #ecf0f1;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        border-radius: 2px;
        padding: 10px;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        text-align: center;
        font-size: 40px;
        font-weight: 100;
        margin-bottom: 30px;
      }
    `}</style>
  </div>
)

const createLink = (href, text) => (
  <a href={href}>
    {text}
    <style jsx>{`
      a {
        color: #333;
        padding-bottom: 2px;
        border-bottom: 1px solid #ccc;
        text-decoration: none;
        font-weight: 400;
        line-height: 30px;
        transition: border-bottom .2s;
      }
      a:hover {
        border-bottom-color: #333;
      }
    `}</style>
  </a>
)

const Index = ({ isAuthenticated }) => (
  <div>
    {isAuthenticated && <SuperSecretDiv />}
    <div className='main'>
      <h1>Hello, friend!</h1>
      <p>
        This is a super simple example of how to use {createLink('https://github.com/zeit/next.js', 'next.js')} and {createLink('https://auth0.com/', 'Auth0')} together.
      </p>
      {!isAuthenticated && (
        <p>
          You're not authenticated yet. Maybe you want to <Link href='/auth/sign-in'>{createLink('/auth/sign-in', 'sign in')}</Link> and see what happens?
        </p>
      )}
      {isAuthenticated && (
        <div>
          <p>
            Now that you're authenticated, maybe you should try going to our <Link href='/secret'>{createLink('/posts', 'super secret posts page')}</Link>!
          </p>
        </div>
      )}
    </div>
    <style jsx>{`
      .main {
        max-width: 750px;
        margin: 0 auto;
        text-align: center;
      }
      h1 {
        font-size: 40;
        font-weight: 200;
        line-height: 40px;
      }
      p {
        font-size: 20px;
        font-weight: 200;
        line-height: 30px;
      }
    `}</style>
  </div>
)

Index.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

export default defaultPage(withData(Index))