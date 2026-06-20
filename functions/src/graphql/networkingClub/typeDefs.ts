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
  }

  type Mutation {
    updateNetworkingClub(
      id: ID!
      input: UpdateNetworkingClubInput!
    ): NetworkingClub!
  }
`;

export default networkingClubTypeDefs;
