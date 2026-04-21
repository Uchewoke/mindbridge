import client from './client'

export const apiSignIn = (email, password) =>
  client.post('/api/auth/signin', { email, password })

export const apiSignUp = (name, email, password, role = 'seeker') =>
  client.post('/api/auth/signup', { name, email, password, role })

export const apiSignOut = () => client.post('/api/auth/signout')

export const apiMe = () => client.get('/api/auth/me')