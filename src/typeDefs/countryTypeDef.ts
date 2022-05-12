import { gql } from 'apollo-server-express'

export default gql`
  type Country {
    id: ID!
    label: String!
    value: String!
  }

  extend type Query {
    getCountries: [Country]
  }
`
