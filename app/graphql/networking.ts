export const NETWORKING_CLUBS_QUERY = `
  query GetNetworkingClubs {
    networkingClubs {
      id
      clubName
      clubType
      otherClubType
      description
      city
      phone
      email
      contactMethod
      socialPlatforms {
        website
        linkedin
        instagram
        other
      }
      onBoardType
      pageType
      ownerUid
      completed
      createdAt
      slugUrl
    }
  }
`;

export const UPDATE_NETWORKING_CLUB_MUTATION = `
  mutation UpdateNetworkingClub($id: ID!, $input: UpdateNetworkingClubInput!) {
    updateNetworkingClub(id: $id, input: $input) {
      id
      clubName
      clubType
      otherClubType
      description
      city
      phone
      email
      contactMethod
      socialPlatforms {
        website
        linkedin
        instagram
        other
      }
      onBoardType
      pageType
      ownerUid
      completed
      createdAt
      slugUrl
    }
  }
`;

/**
 * Paginated club search query — supports server-side category filtering.
 */
export const GET_CLUBS_PAGINATED_QUERY = `
  query GetClubs(
    $where: ClubWhereInput
    $page: Int
    $limit: Int
  ) {
    clubs(where: $where, page: $page, limit: $limit) {
      items {
        id
        clubName
        clubType
        otherClubType
        description
        city
        phone
        email
        contactMethod
        socialPlatforms {
          website
          linkedin
          instagram
          other
        }
        onBoardType
        pageType
        ownerUid
        completed
        createdAt
        slugUrl
        logoUrl
        bannerUrl
      }
      pagination {
        page
        limit
        totalCount
        hasNextPage
      }
    }
  }
`;

