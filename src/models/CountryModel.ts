import { Schema, model } from 'mongoose'

export interface ICountry {
  id?: string
  label: string
  value: string
}

const CountrySchema = new Schema<ICountry>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
)

CountrySchema.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<ICountry>('Country', CountrySchema)
