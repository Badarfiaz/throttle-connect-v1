const marketplaceStoreTypeDefs = /* GraphQL */ `
  type MarketplaceLocation {
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
    location: MarketplaceLocation
    onBoardType: String
    pageType: String
    ownerUid: ID
    completed: Boolean
    createdAt: String
  }

  type Query {
    marketplaceStores: [MarketplaceStore!]!
  }
`;

export default marketplaceStoreTypeDefs;
