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
    bannerUrl
    logoUrl
    location { area city province }
    onBoardType
    overview
    ownerUid
    pageType
    phone
  }
}`;
export const MARKETPLACE_STORE_PROFILE_QUERY = `
  query MarketplaceStoreProfile($slugUrl: String!) {
    marketplaceStoreProfile(slugUrl: $slugUrl) {
      id
      title
      address
      businessType
      completed
      contactMethod
      createdAt
      email
      bannerUrl
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
export const GET_PRODUCTS_BY_CATEGORY_QUERY = `
  query GetProductsByCategory($category: String!) {
    getProductsByCategory(category: $category) {
      id
      productName
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      price
      category
      description
      owner {
        id
        title
        contactMethod
        logoUrl
        slugUrl
        phone
        email
        location { area city province }
      }
      createdAt
      updatedAt
    }
  }
`;
export const MARKETPLACE_ALL_STORES_QUERY = `{
  marketplaceAllStores {
    id
    title
    bannerUrl
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
      bannerUrl
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

export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateMarketplaceProductInput!) {
    createMarketplaceProduct(input: $input) {
      id
      ownerUid
      productName
      category
      description
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  query GetProducts {
    marketplaceProducts {
      id
      ownerUid
      owner {
        id
        title
        contactMethod
        logoUrl
        slugUrl
        phone
        email
        location { area city province }
      }
      productName
      category
      description
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_BY_OWNER_UID_QUERY = `
  query GetProductsByOwnerUid($ownerUid: ID!) {
    marketplaceProductsByOwnerUid(ownerUid: $ownerUid) {
      id
      ownerUid
      owner {
        id
        title
        contactMethod
        logoUrl
        slugUrl
        phone
        email
        location { area city province }
      }
      productName
      category
      description
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_ID_QUERY = `
  query GetProductById($id: ID!) {
    marketplaceProduct(id: $id) {
      id
      ownerUid
      owner {
        id
        title
        contactMethod
        logoUrl
        slugUrl
        phone
        email
        location { area city province }
      }
      productName
      category
      description
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: ID!, $input: UpdateMarketplaceProductInput!) {
    updateMarketplaceProduct(id: $id, input: $input) {
      id
      ownerUid
      productName
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      category
      description
      price
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteMarketplaceProduct(id: $id)
  }
`;
export const GET_FEATURED_PRODUCTS_QUERY = `
  query GetFeaturedProducts {
    getMarketplaceFeaturedProducts {
      id
      productName
      images {
        ref
        url
      }
      imageurl {
        ref
        url
      }
      stock
      price
      category
      description
      owner {
        id
        title
        contactMethod
        logoUrl
        slugUrl
        phone
        email
        location { area city province }
      }
      createdAt
      updatedAt
    }
  }
`;
