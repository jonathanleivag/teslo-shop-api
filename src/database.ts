import mongoose from 'mongoose'
import { MONGO_DB } from './utils'

export const database = async () => {
  try {
    await mongoose.connect(MONGO_DB)
    // eslint-disable-next-line no-console
    console.log('MongoDB connected 🌿')
  } catch (error) {
    console.error('MongoDB not connected ❎', error)
  }
}
