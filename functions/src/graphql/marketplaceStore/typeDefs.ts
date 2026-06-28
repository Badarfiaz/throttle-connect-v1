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
    bannerUrl: String
    logoUrl: String
    slugUrl: String
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
    bannerUrl: String
    logoUrl: String
    location: MarketplaceLocationInput
    onBoardType: String
    pageType: String
  }

  type ServiceReview {
    id: ID!
    serviceId: ID!
    storeId: ID!
    reviewerUid: ID!
    reviewerName: String
    rating: Int!
    comment: String
    createdAt: String
  }

  type MarketplaceService {
    id: ID!
    storeId: ID!
    ownerUid: ID!
    store: MarketplaceStore
    title: String!
    serviceType: String!
    description: String
    price: Float
    priceUnit: String
    imageUrl: String
    isAvailable: Boolean!
    reviews: [ServiceReview!]!
    averageRating: Float
    reviewCount: Int
    createdAt: String
    updatedAt: String
  }

  input CreateMarketplaceServiceInput {
    title: String!
    serviceType: String!
    description: String
    price: Float
    priceUnit: String
    imageUrl: String
    isAvailable: Boolean
  }

  input UpdateMarketplaceServiceInput {
    title: String
    serviceType: String
    description: String
    price: Float
    priceUnit: String
    imageUrl: String
    isAvailable: Boolean
  }

  input CreateServiceReviewInput {
    storeId: ID!
    serviceId: ID!
    rating: Int!
    comment: String
    reviewerName: String
  }

  type Query {
    marketplaceStores: [MarketplaceStore!]!
    marketplaceAllStores: [MarketplaceStore!]!
    marketplaceStoreProfile(slugUrl: String!): [MarketplaceStore!]!
    myStoreServices: [MarketplaceService!]!
    storeServices(storeId: ID!): [MarketplaceService!]!
    featuredServices(limit: Int): [MarketplaceService!]!
    marketplaceService(storeId: ID!, serviceId: ID!): MarketplaceService
    marketplaceServiceById(id: ID!): MarketplaceService
  }

  type Mutation {
    updateMarketplaceStore(
      id: ID!
      input: UpdateMarketplaceStoreInput!
    ): MarketplaceStore!
    createMarketplaceService(input: CreateMarketplaceServiceInput!): MarketplaceService!
    updateMarketplaceService(storeId: ID!, serviceId: ID!, input: UpdateMarketplaceServiceInput!): MarketplaceService!
    deleteMarketplaceService(storeId: ID!, serviceId: ID!): Boolean!
    addServiceReview(input: CreateServiceReviewInput!): ServiceReview!
  }
`;

export default marketplaceStoreTypeDefs;
