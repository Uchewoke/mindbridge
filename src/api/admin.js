import client from './client'

export const fetchAdminState = () => client.get('/api/admin/state')

export const fetchFlags = () => client.get('/api/admin/flags')

export const dismissFlag = (id) => client.delete(`/api/admin/flags/${id}`)

export const fetchUsers = () => client.get('/api/admin/users')

export const updateUser = (id, patch) => client.patch(`/api/admin/users/${id}`, patch)

export const updateAdminUserStatus = (id, status) =>
  client.patch(`/api/admin/state/users/${id}`, { status })

export const updateAdminMentorStatus = (id, status) =>
  client.patch(`/api/admin/state/mentors/${id}`, { status })

export const updateAdminFlagAction = (id, action) =>
  client.patch(`/api/admin/state/flags/${id}`, { action })

export const fetchSafetyEvents = () => client.get('/api/admin/reports')
