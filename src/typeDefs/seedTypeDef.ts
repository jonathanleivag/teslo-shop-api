import { gql } from 'apollo-server-express'

export type TSeed = string
export interface ISeedInputData {
  noUser?: boolean
  noProduct?: boolean
  noCountry?: boolean
}
export interface ISeedInput {
  input: ISeedInputData
}
export default gql`
  input SeedInput {
    noUser: Boolean
    noProduct: Boolean
    noCountry: Boolean
  }

  type Mutation {
    seed(input: SeedInput): String
  }
`
