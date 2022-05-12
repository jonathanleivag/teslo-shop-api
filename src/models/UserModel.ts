import { Schema, model } from 'mongoose'

export interface IUser {
  id?: string
  name: string
  email: string
  password?: string
  role: TRole
  createdAt?: string
  updatedAt?: string
}

export type TRole = 'admin' | 'client'

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'client'] }
  },
  { timestamps: true, versionKey: false }
)

UserSchema.method('toJSON', function () {
  const { _id, password, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IUser>('User', UserSchema)
