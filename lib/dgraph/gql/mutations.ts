import * as fragments from './fragments'

export const updateGQLSchema = /* GraphQL */ `
  mutation UpdateGQLSchema($schema: String!) {
    updateGQLSchema(input: { set: { schema: $schema } }) {
      gqlSchema {
        ...GQLSchemaFragment
      }
    }
  }
  ${fragments.GQLSchema}
`

export const dropData = /* GraphQL */ `
mutation DropAllData() {
  dropData(allData: true) {
    response {
      code
      message
    }
  }
}
`
