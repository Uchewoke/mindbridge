import { z } from 'zod'

export const emailSchema = z.string().email()
export const idSchema = z.string().min(1)
