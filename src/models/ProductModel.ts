import { Schema, model } from 'mongoose'

export interface IProduct {
  id: string
  description: string
  images: string[]
  inStock: number
  price: number
  sizes: TValidSize[]
  slug: string
  tags: string[]
  title: string
  type: TValidType
  gender: TGender
  createdAt: string
  updatedAt: string
}

export type TValidSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'
export type TValidType = 'shirts' | 'pants' | 'hoodies' | 'hats'
export type TGender = 'men' | 'woman' | 'kid' | 'unisex'

const ProductSchema = new Schema<IProduct>(
  {
    description: { type: String, required: true },
    images: { type: [String] },
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: { type: [String], required: true, default: [] },
    slug: { type: String, required: true },
    tags: { type: [String], required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: {
        values: ['shirts', 'pants', 'hoodies', 'hats'],
        message: 'Invalid type {VALUE}'
      }
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ['men', 'woman', 'kid', 'unisex'],
        message: 'Invalid gender {VALUE}'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

ProductSchema.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IProduct>('Product', ProductSchema)
