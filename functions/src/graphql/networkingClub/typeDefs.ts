const networkingClubTypeDefs = /* GraphQL */ `
  type NetworkingSocialPlatforms {
    website: String
    linkedin: String
    instagram: String
    other: String
  }

  input NetworkingSocialPlatformsInput {
    website: String
    linkedin: String
    instagram: String
    other: String
  }

  type NetworkingClub {
    id: ID!
    clubName: String
    clubType: String
    otherClubType: String
    description: String
    city: String
    phone: String
    email: String
    contactMethod: String
    socialPlatforms: NetworkingSocialPlatforms
    onBoardType: String
    pageType: String
    ownerUid: ID
    completed: Boolean
    createdAt: String
    slugUrl: String
    logoUrl: String
    bannerUrl: String
  }

  # Pagination metadata for networking clubs
  type NetworkingPaginationInfo {
    page: Int!
    limit: Int!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  # Paginated networking clubs result
  type NetworkingClubsPage {
    items: [NetworkingClub!]!
    pagination: NetworkingPaginationInfo!
  }

  # Filter input for club queries
  input ClubWhereInput {
    category: String
    city: String
  }

  input UpdateNetworkingClubInput {
    clubName: String
    clubType: String
    otherClubType: String
    description: String
    city: String
    phone: String
    email: String
    contactMethod: String
    socialPlatforms: NetworkingSocialPlatformsInput
  }

  type Query {
    networkingClubs: [NetworkingClub!]!
    networkingAllClubs: [NetworkingClub!]!
    networkingClubProfile(slugUrl: String!): [NetworkingClub!]!
    # New paginated query with where-filter support
    clubs(where: ClubWhereInput, page: Int, limit: Int): NetworkingClubsPage!
  }

  type Mutation {
    updateNetworkingClub(
      id: ID!
      input: UpdateNetworkingClubInput!
    ): NetworkingClub!
  }
`;

export default networkingClubTypeDefs;
