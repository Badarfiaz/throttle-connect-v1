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
    imageUrlMulti: [ImageUrl]
    stock: Int!
    owner: MarketplaceStore
    category: String
    description: String
    price: Float!
    featured: Boolean
    createdAt: String
    updatedAt: String
  }

  # Pagination metadata returned alongside paginated results
  type PaginationInfo {
    page: Int!
    limit: Int!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  # Paginated product result wrapper
  type MarketplaceProductsPage {
    items: [MarketplaceProduct!]!
    pagination: PaginationInfo!
  }

  # Filter input for product queries
  input ProductWhereInput {
    category: String
    ownerUid: ID
  }

  input CreateMarketplaceProductInput {
    productName: String!
    imageurl: ImageUrlInput
    imageUrlMulti: [ImageUrlInput]
    stock: Int!
    price: Float!
    category: String
    description: String
  }

  input UpdateMarketplaceProductInput {
    productName: String
    imageurl: ImageUrlInput
    imageUrlMulti: [ImageUrlInput]
    stock: Int
    price: Float
    category: String
    description: String
  }

  type Query {
    marketplaceProducts: [MarketplaceProduct!]!
    marketplaceProductsByOwnerUid(ownerUid: ID!): [MarketplaceProduct!]!
    marketplaceProduct(id: ID!): MarketplaceProduct
    getMarketplaceFeaturedProducts: [MarketplaceProduct!]!
    getProductsByCategory(category: String!): [MarketplaceProduct!]!
    # New paginated query with where-filter support
    products(where: ProductWhereInput, page: Int, limit: Int): MarketplaceProductsPage!
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
