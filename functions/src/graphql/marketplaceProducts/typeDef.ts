const marketplaceProductsTypeDefs = /* GraphQL */ `
  type ImageUrl {
    ref: String
    url: String!
  }

  input ImageUrlInput {
    ref: String
    url: String!
  }

  type MarketplaceProduct {
    id: ID!
    ownerUid: ID!
    productName: String!
    imageurl: ImageUrl
    stock: Int!
    price: Float!
    createdAt: String
    updatedAt: String
  }

  input CreateMarketplaceProductInput {
    productName: String!
    imageurl: ImageUrlInput
    stock: Int!
    price: Float!
  }

  input UpdateMarketplaceProductInput {
    productName: String
    imageurl: ImageUrlInput
    stock: Int
    price: Float
  }

  type Query {
    marketplaceProducts: [MarketplaceProduct!]!
    marketplaceProduct(id: ID!): MarketplaceProduct
  }

  type Mutation {
    createMarketplaceProduct(
      input: CreateMarketplaceProductInput!
    ): MarketplaceProduct!
    updateMarketplaceProduct(
      id: ID!
      input: UpdateMarketplaceProductInput!
    ): MarketplaceProduct!
    deleteMarketplaceProduct(id: ID!): Boolean!
  }
`;

export default marketplaceProductsTypeDefs;
