// BullMQ Connection Konfigürasyonu
// Hedef Performans - Kadro Atama Sistemi

import { ConnectionOptions } from 'bullmq'

export const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD ?? undefined,
  maxRetriesPerRequest: null, // ZORUNLU
}
