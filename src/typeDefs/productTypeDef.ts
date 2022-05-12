import { gql } from 'apollo-server-express'
import { TGender } from '../models'

export type TProductsTypeDefs = {
  gender: TGender
}

export type TProductBySlug = {
  slug: string
}

export type TSearchProduct = {
  search: string
}

export default gql`
  enum Esize {
    XS
    S
    M
    L
    XL
    XXL
    XXXL
  }

  enum EType {
    shirts
    pants
    hoodies
    hats
  }

  enum EGender {
    men
    woman
    kid
    unisex
  }

  type Product {
    id: ID!
    description: String!
    images: [String!]
    inStock: Int!
    price: Int!
    sizes: [Esize!]!
    slug: String!
    tags: [String!]!
    title: String!
    type: EType!
    gender: EGender!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    products(gender: EGender): [Product]
    productBySlug(slug: String!): Product
    searchProduct(search: String!): [Product]
    producById(id: ID!): Product
  }
`
