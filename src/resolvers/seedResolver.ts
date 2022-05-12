import {
  AddressModel,
  CountryModel,
  OrderModel,
  ProductModel,
  UserModel
} from '../models'
import { countries, initialDataProduct, initialDataUser } from '../seed'
import { ISeedInput, TSeed } from '../typeDefs'
import { URL_FRONTEND } from '../utils'

export default {
  Mutation: {
    seed: async (_: null, { input }: ISeedInput): Promise<TSeed> => {
      await AddressModel.deleteMany()
      await CountryModel.deleteMany()
      await OrderModel.deleteMany()
      await ProductModel.deleteMany()
      await UserModel.deleteMany()

      const { noUser, noProduct, noCountry } = input

      if (!noUser) {
        await UserModel.insertMany(initialDataUser.users)
      }

      if (!noProduct) {
        const products = initialDataProduct.products.map(product => {
          const img = product.images.map(
            image => (image = `${URL_FRONTEND}/products/${image}`)
          )
          product.images = img
          return product
        })
        await ProductModel.insertMany(products)
      }

      if (!noCountry) {
        await CountryModel.insertMany(countries)
      }

      return 'Se ha creado el seed de productos con exito'
    }
  }
}
