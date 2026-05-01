const marketplaceStoreTypeDefs = /* GraphQL */ `
  type MarketplaceLocation {
    area: String
    city: String
    province: String
  }

  input MarketplaceLocationInput {
    area: String
    city: String
    province: String
  }

  type MarketplaceStore {
    id: ID!
    title: String
    overview: String
    address: String
    businessType: [String!]
    contactMethod: String
    phone: String
    email: String
    logoUrl: String
    location: MarketplaceLocation
    onBoardType: String
    pageType: String
    ownerUid: ID
    completed: Boolean
    createdAt: String
  }

  input UpdateMarketplaceStoreInput {
    title: String
    overview: String
    address: String
    businessType: [String!]
    contactMethod: String
    phone: String
    email: String
    logoUrl: String
    location: MarketplaceLocationInput
    onBoardType: String
    pageType: String
  }

  type Query {
    marketplaceStores: [MarketplaceStore!]!
    marketplaceAllStores: [MarketplaceStore!]!
  }

  type Mutation {
    updateMarketplaceStore(
      id: ID!
      input: UpdateMarketplaceStoreInput!
    ): MarketplaceStore!
  }
`;

export default marketplaceStoreTypeDefs;
