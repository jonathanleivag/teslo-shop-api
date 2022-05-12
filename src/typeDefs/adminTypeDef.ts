import { gql } from 'apollo-server-express'
import { TRole } from '../models'
import { TGender, TValidSize, TValidType } from '../models/ProductModel'

export interface IDashboard {
  numberOfOrders: number
  paidOrders: number
  numberOfClient: number
  numberOfProducts: number
  productsWithNoInventory: number
  lowInventory: number
  noPaidOrders: number
}

export interface IUpdateRoleInput {
  input: IUpdateRoleInputData
}
export interface IUpdateRoleInputData {
  idUser: string
  idUserUpdate: string
  role: TRole
}

export interface IGetOneOrderAdminInputData {
  id: string
  idUser: string
}
export interface IGetOneOrderAdminInput {
  input: IGetOneOrderAdminInputData
}

export type TStatus = 'pending' | 'paid' | 'all'

export interface IProductData {
  product: {
    id?: string
    description: string
    inStock: number
    price: number
    images: string[]
    sizes: TValidSize[]
    slug: string
    tags: string[]
    title: string
    type: TValidType
    gender: TGender
  }
  idUser: string
}
export interface IUpdateProductInput {
  input: IProductData
}

export default gql`
  type Dashboard {
    numberOfOrders: Int
    paidOrders: Int
    numberOfClient: Int
    numberOfProducts: Int
    productsWithNoInventory: Int
    lowInventory: Int
    noPaidOrders: Int
  }

  enum EStatus {
    pending
    paid
    all
  }

  input UpdateRoleInput {
    idUser: ID!
    idUserUpdate: ID!
    role: ERole!
  }

  input GetOneOrderAdminInput {
    id: ID!
    idUser: ID!
  }

  input ProductInput {
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
  }

  input UpdateProductInput {
    product: ProductInput!
    idUser: ID!
  }

  extend type Query {
    dashboard(idUser: ID!): Dashboard
    getUsers(idUser: ID!): [User]
    getAllOrder(idUser: ID!, status: EStatus): [Order]
    getOneOrderAdmin(input: GetOneOrderAdminInput): Order
    productsWithNoInventory(idUser: ID!): [Product]
    lowInventory(idUser: ID!): [Product]
  }

  extend type Mutation {
    updateRole(input: UpdateRoleInput): String
    updateProduct(input: UpdateProductInput): String
    addProduct(input: UpdateProductInput): String
    deleteProduct(input: GetOneOrderAdminInput): String
  }
`
