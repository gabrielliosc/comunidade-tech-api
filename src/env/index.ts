import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().default('./database/app.db'),
    PORT: z.number().default(3333),
})

export const env = envSchema.parse(process.env)