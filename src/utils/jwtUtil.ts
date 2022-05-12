import jwt from 'jsonwebtoken'
import { TRole } from '../models'
import { JWT_SECRET } from './envUtil'

export interface IJwtPayload {
  id: string
  name: string
  email: string
  role: TRole
  createdAt: string
  updatedAt: string
}

export const jwtSign = (payload: IJwtPayload, expiresIn: string = '30d') =>
  jwt.sign(payload, JWT_SECRET, { expiresIn })

export const jwtVerify = (token: string): IJwtPayload =>
  jwt.verify(token, JWT_SECRET) as IJwtPayload
