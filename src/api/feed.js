import client from './client'

export const fetchPosts = () => client.get('/api/posts')

export const createPost = (body) => client.post('/api/posts', body)

export const toggleLike = (id) => client.post(`/api/posts/${id}/like`)