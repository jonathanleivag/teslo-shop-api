import { Schema, model } from 'mongoose'
import { ICountry } from '../typeDefs'
import { IUser } from './UserModel'

export interface IAddress {
  id?: string
  address: string
  address0?: string
  postalCode: string
  city: string
  phono: string
  country: ICountry
  user: IUser
  createdAt?: string
  updatedAt?: string
}

const AddressSchema = new Schema<IAddress>(
  {
    address: { type: String, required: true },
    address0: { type: String, required: false },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    phono: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, required: true, ref: 'Country' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true, versionKey: false }
)

AddressSchema.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IAddress>('Address', AddressSchema)
