// Vercel serverless entry-point — wraps the Express backend app.
// Vercel bundles this and all its imports at deploy time.
// Rewrites in vercel.json direct /api/* here; Express sees the original URL.

import 'dotenv/config'
import { createApp } from './backend/dist/app.js'

export default createApp()
