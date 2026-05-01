export const MARKETPLACE_STORES_QUERY = `{
  marketplaceStores {
    id
    title
    address
    businessType
    completed
    contactMethod
    createdAt
    email
    logoUrl
    location { area city province }
    onBoardType
    overview
    ownerUid
    pageType
    phone
  }
}`;

export const MARKETPLACE_ALL_STORES_QUERY = `{
  marketplaceAllStores {
    id
    title
    logoUrl
    slugUrl
  }
}`;

export const MARKETPLACE_COMPLETED_QUERY = `{
  marketplaceStores {
    completed
  }
}`;

export const UPDATE_MARKETPLACE_STORE_MUTATION = `
  mutation UpdateMarketplaceStore($id: ID!, $input: UpdateMarketplaceStoreInput!) {
    updateMarketplaceStore(id: $id, input: $input) {
      id
      title
      address
      businessType
      completed
      contactMethod
      createdAt
      email
      logoUrl
      location { area city province }
      onBoardType
      overview
      ownerUid
      pageType
      phone
    }
  }
`;
