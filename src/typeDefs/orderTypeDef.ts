import { gql } from 'apollo-server-express'
import { TGender, TValidSize } from '../models'

export interface IAddOrderItemInput {
  id: string
  image: string
  price: number
  size: TValidSize
  slug: string
  title: string
  gender: TGender
  quantity: number
}

export interface IOrderInput {
  idUser: string
  numberOfItem: number
  subtotal: number
  tax: number
  total: number
  orderItems: IAddOrderItemInput[]
}

export interface IAddOrderInput {
  input: IOrderInput
}

export interface IPayPaypalInputData {
  orderId: string
  transactionId: string
  userId: string
}
export interface IPayPaypalInput {
  input: IPayPaypalInputData
}

export default gql`
  enum EGender {
    men
    woman
    kid
    unisex
  }

  enum EValidSize {
    XS
    S
    M
    L
    XL
    XXL
    XXXL
  }

  type OrderItem {
    id: String
    image: String
    price: Int
    slug: String
    title: String
    gender: EGender
    size: EValidSize
    quantity: Int
  }

  type CountryOrder {
    label: String
    value: String
  }

  type AddressOrder {
    address: String
    address0: String
    postalCode: String
    city: String
    phono: String
    country: CountryOrder
  }

  type Order {
    id: ID
    user: User
    numberOfItem: Int
    subtotal: Int
    tax: Float
    total: Float
    isPaid: Boolean
    paidAt: String
    paymetResult: String
    orderItems: [OrderItem]
    inCart: Boolean
    address: AddressOrder
    updatedAt: String
  }

  input AddOrderItemInput {
    id: ID!
    image: String!
    price: Int!
    size: EValidSize!
    slug: String!
    title: String!
    gender: EGender!
    quantity: Int!
  }

  input AddOrderInput {
    idUser: ID!
    numberOfItem: Int!
    subtotal: Int!
    tax: Float!
    total: Float!
    orderItems: [AddOrderItemInput]
  }

  input PayPaypalInput {
    orderId: ID!
    transactionId: String!
    userId: ID!
  }

  extend type Query {
    loadOrderInCart(idUser: ID!): Order
    getOneOrder(id: ID!): Order
    getAllOrderByUser(idUser: ID!): [Order]
  }

  extend type Mutation {
    addOrder(input: AddOrderInput): String
    order(idUser: ID!, address: ID!): String
    payPaypal(input: PayPaypalInput): String
  }
`
