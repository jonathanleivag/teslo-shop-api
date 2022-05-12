import { gql } from 'apollo-server-express'
import { IUser, TRole } from '../models'

export interface IUserLoginInput {
  input: {
    email: string
    password: string
  }
}

export interface IUserLoginWithOauthInput {
  input: {
    email: string
    name: string
  }
}

export interface IUserRegisterInputData {
  name: string
  email: string
  password: string
  password0: string
  role: TRole
}

export interface IUserRegisterInput {
  input: IUserRegisterInputData
}

export interface IRUser {
  user: IUser
  token: string
  message?: string
}

export type ESessionType = 'auth0' | 'email'
export interface IRGetOneUser {
  user: IUser
  type: ESessionType
}

export interface IUserUpdateInputData {
  id: string
  name: string
  email: string
}

export interface IUserUpdateInput {
  input: IUserUpdateInputData
}

export interface IUpdatePasswordInputData {
  id: string
  password: string
  password0: string
  password1: string
}
export interface IUpdatePasswordInput {
  input: IUpdatePasswordInputData
}

export default gql`
  type User {
    id: ID
    name: String
    email: String
    role: String
    createdAt: String
    updatedAt: String
  }

  enum ERole {
    admin
    client
  }

  enum ESessionType {
    auth0
    email
  }

  type RUser {
    token: String
    user: User
    message: String
  }

  type RGetOneUser {
    user: User
    type: ESessionType
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  input UserLoginWithOauthInput {
    email: String!
    name: String!
  }

  input UserRegisterInput {
    name: String!
    email: String!
    password: String!
    password0: String!
    role: ERole!
  }

  input UserUpdateInput {
    id: ID!
    name: String
    email: String
  }

  input UpdatePasswordInput {
    id: ID!
    password: String!
    password0: String!
    password1: String!
  }

  extend type Query {
    login(input: UserLoginInput!): RUser
    checkToken: RUser
    getOneUser(idUser: ID!): RGetOneUser
  }

  extend type Mutation {
    register(input: UserRegisterInput): RUser
    loginWithOauth(input: UserLoginWithOauthInput!): RUser
    updateUser(input: UserUpdateInput): String
    updatePassword(input: UpdatePasswordInput): String
  }
`
