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
    category: String
    description: String
    price: Float!
    createdAt: String
    updatedAt: String
  }

  input CreateMarketplaceProductInput {
    productName: String!
    imageurl: ImageUrlInput
    stock: Int!
    price: Float!
    category: String
    description: String
  }

  input UpdateMarketplaceProductInput {
    productName: String
    imageurl: ImageUrlInput
    stock: Int
    price: Float
    category: String
    description: String
  }

  type Query {
    marketplaceProducts: [MarketplaceProduct!]!
    marketplaceProduct(id: ID!): MarketplaceProduct
    getMarketplaceFeaturedProducts: [MarketplaceProduct!]!
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
