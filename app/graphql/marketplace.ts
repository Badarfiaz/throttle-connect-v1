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
    location { area city province }
    onBoardType
    overview
    ownerUid
    pageType
    phone
  }
}`;

export const MARKETPLACE_COMPLETED_QUERY = `{
  marketplaceStores {
    completed
  }
}`;
