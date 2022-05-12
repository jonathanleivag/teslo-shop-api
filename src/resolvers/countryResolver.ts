import { CountryModel } from '../models'
import { ICountry } from '../typeDefs'

export default {
  Query: {
    getCountries: async (): Promise<ICountry[]> => await CountryModel.find()
  }
}
