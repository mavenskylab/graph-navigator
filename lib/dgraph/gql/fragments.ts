export const GQLSchema = /* GraphQL */ `
  fragment GQLSchemaFragment on GQLSchema {
    schema
  }
`

export const DgraphSchema = /* GraphQL */ `
  fragment DgraphSchemaFragment on GQLSchema {
    generatedSchema
  }
`
