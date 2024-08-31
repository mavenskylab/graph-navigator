import * as fragments from './fragments'

export const getGQLSchema = /* GraphQL */ `
  query GetGQLSchema {
    getGQLSchema {
      ...GQLSchemaFragment
    }
  }
  ${fragments.GQLSchema}
`

export const getDgraphSchema = /* GraphQL */ `
  query GetDgraphSchema {
    getGQLSchema {
      ...DgraphSchemaFragment
    }
  }
  ${fragments.DgraphSchema}
`
