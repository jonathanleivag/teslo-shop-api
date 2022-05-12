import dotenv from 'dotenv'
dotenv.config()

export const PORT: string = process.env.PORT || '3000'
export const MONGO_DB: string = process.env.MONGO_DB || ''
export const JWT_SECRET: string = process.env.JWT_SECRET || ''
export const URL_FRONTEND: string = process.env.URL_FRONTEND || ''
export const TAX: number = Number(process.env.TAX) || 0
export const PAYPAL_SECRET_ID: string = process.env.PAYPAL_SECRET_ID || ''
export const PAYPAL_CLIENT_ID: string = process.env.PAYPAL_CLIENT_ID || ''
export const PAYPAL_OAUTH_URL: string = process.env.PAYPAL_OAUTH_URL || ''
export const PAYPAL_ORDERS_URL: string = process.env.PAYPAL_ORDERS_URL || ''
export const CLOUDINARY_URL: string = process.env.CLOUDINARY_URL || ''
