import { merge } from 'lodash'
import addressResolver from './addressResolver'
import adminResolver from './adminResolver'
import countryResolver from './countryResolver'
import orderResolver from './orderResolver'
import productResolver from './productResolver'
import seedResolver from './seedResolver'
import userResolver from './userResolver'

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  }
]

const resolvers = {
  Query: {
    books: () => books
  }
}

export default merge(
  resolvers,
  seedResolver,
  productResolver,
  userResolver,
  addressResolver,
  countryResolver,
  orderResolver,
  adminResolver
)
