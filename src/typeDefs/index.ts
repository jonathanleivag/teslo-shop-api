import { gql } from 'apollo-server-express'
import addressTypeDef from './addressTypeDef'
import adminTypeDef from './adminTypeDef'
import countryTypeDef from './countryTypeDef'
import orderTypeDef from './orderTypeDef'
import productTypeDef from './productTypeDef'
import seedTypeDef from './seedTypeDef'
import userTypeDef from './userTypeDef'

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

export * from './addressTypeDef'
export * from './adminTypeDef'
export * from './orderTypeDef'
export * from './productTypeDef'
export * from './seedTypeDef'
export * from './userTypeDef'

export default [
  typeDefs,
  seedTypeDef,
  productTypeDef,
  userTypeDef,
  addressTypeDef,
  countryTypeDef,
  orderTypeDef,
  adminTypeDef
]
