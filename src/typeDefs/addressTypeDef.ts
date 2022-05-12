import { gql } from 'apollo-server-express'
import { IUser } from '../models'

export interface ICountry {
  id: string
  label: string
  value: string
}

export interface IAddress {
  id: string
  address: string
  address0?: string
  postalCode: string
  city: string
  phono: string
  country: ICountry
  user: IUser
  createdAt: string
  updatedAt: string
}

export interface IRAddress {
  message: string
  address: IAddress
}

export interface IAddAddressInputData {
  address: string
  address0?: string
  postalCode: string
  city: string
  phono: string
  country: string
  user: string
}

export interface IAddAddressInput {
  input: IAddAddressInputData
}

export default gql`
  type Country {
    id: ID
    label: String
    value: String
  }

  type Address {
    id: ID
    address: String
    address0: String
    postalCode: String
    city: String
    phono: String
    country: Country
    user: User
    createdAt: String
    updatedAt: String
  }

  type RAddress {
    message: String
    address: Address
  }

  input AddAddressInput {
    address: String!
    address0: String
    postalCode: String!
    city: String!
    phono: String!
    country: String!
    user: String!
  }

  extend type Query {
    getAddress(id: ID!): Address
    getAddressesByUser(idUser: ID!): [Address]
  }

  extend type Mutation {
    addAddress(input: AddAddressInput): RAddress
    deleteAddress(id: ID!): String
    editAddress(id: ID!, input: AddAddressInput): RAddress
  }
`
