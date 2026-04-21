import client from './client'

export const fetchFlags = () => client.get('/api/admin/flags')

export const dismissFlag = (id) => client.delete(`/api/admin/flags/${id}`)

export const fetchUsers = () => client.get('/api/admin/users')

export const updateUser = (id, patch) => client.patch(`/api/admin/users/${id}`, patch)