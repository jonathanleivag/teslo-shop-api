import { Schema, model } from 'mongoose'
import { TGender, TValidSize } from './ProductModel'
import { IUser } from './UserModel'

export interface IOrderItem {
  id?: string
  image: string
  price: number
  size: TValidSize
  slug: string
  title: string
  gender: TGender
  quantity: number
}

export interface IOrder {
  id?: string
  user: IUser
  numberOfItem: number
  subtotal: number
  tax: number
  total: number
  isPaid: boolean
  paidAt?: string
  paymetResult?: string
  orderItems: IOrderItem[]
  inCart: boolean
  address?: {
    address: string
    address0?: string
    postalCode: string
    city: string
    phono: string
    country: {
      label: string
      value: string
    }
  }
  transactionId?: string
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    numberOfItem: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String, required: false },
    paymetResult: { type: String, required: false },
    orderItems: [
      {
        id: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        slug: { type: String, required: true },
        title: { type: String, required: true },
        gender: {
          type: String,
          required: true,
          enum: {
            values: ['men', 'woman', 'kid', 'unisex'],
            message: 'Invalid gender {VALUE}'
          }
        },
        size: {
          type: String,
          required: true,
          enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: 'Invalid gender {VALUE}'
          }
        },
        quantity: { type: Number, required: true }
      }
    ],
    inCart: { type: Boolean, required: true, default: true },
    address: {
      type: {
        address: { type: String, required: true },
        address0: { type: String, required: false },
        postalCode: { type: String, required: true },
        city: { type: String, required: true },
        phono: { type: String, required: true },
        country: {
          label: { type: String, required: true },
          value: { type: String, required: true }
        }
      },
      required: false
    },
    transactionId: { type: String, required: false }
  },
  { timestamps: true, versionKey: false }
)

OrderSchema.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IOrder>('Order', OrderSchema)
