import client from './client'

export const requestAccountExport = () => client.post('/api/account/export')

export const deactivateAccount = () => client.post('/api/account/deactivate')
