import { setSecret } from './auth'

import uuid from 'uuid'

const getLock = (options) => {
  const Auth0Lock = require('auth0-lock').default
  console.log(process.env)
  return new Auth0Lock("56k9uOTkKnRGHeGp2GkF2jcHGMe3OgLq", "gpsimpact.auth0.com", options)
}

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

const getOptions = (container) => {
  const secret = uuid.v4()
  setSecret(secret)
  return {
    container,
    closable: false,
    auth: {
      responseType: 'token',
      redirectUrl: `${getBaseUrl()}/auth/signed-in`,
      params: {
        scope: 'openid profile email',
        state: secret
      }
    }
  }
}

export const show = (container) => getLock(getOptions(container)).show()
export const logout = () => getLock().logout({ returnTo: getBaseUrl() })