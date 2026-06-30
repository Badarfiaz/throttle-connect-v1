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
    slugUrl
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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
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
    businessType
          location { area city province }

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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
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
      imageurl {
        ref
        url
      }
      imageUrlMulti {
        ref
        url
      }
      stock
      price
      featured
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

const SERVICE_FIELDS = `
  id
  storeId
  ownerUid
  title
  serviceType
  description
  price
  priceUnit
  imageUrl
  isAvailable
  averageRating
  reviewCount
  createdAt
  updatedAt
  store {
    id
    title
    logoUrl
    slugUrl
    location { area city province }
    phone
    email
  }
`;

const REVIEW_FIELDS = `
  id
  serviceId
  storeId
  reviewerUid
  reviewerName
  rating
  comment
  createdAt
`;

export const MY_STORE_SERVICES_QUERY = `
  query MyStoreServices {
    myStoreServices {
      ${SERVICE_FIELDS}
      reviews { ${REVIEW_FIELDS} }
    }
  }
`;

export const STORE_SERVICES_QUERY = `
  query StoreServices($storeId: ID!) {
    storeServices(storeId: $storeId) {
      ${SERVICE_FIELDS}
      reviews { ${REVIEW_FIELDS} }
    }
  }
`;

export const FEATURED_SERVICES_QUERY = `
  query FeaturedServices($limit: Int) {
    featuredServices(limit: $limit) {
      ${SERVICE_FIELDS}
    }
  }
`;

export const GET_MARKETPLACE_SERVICE_QUERY = `
  query GetMarketplaceService($storeId: ID!, $serviceId: ID!) {
    marketplaceService(storeId: $storeId, serviceId: $serviceId) {
      ${SERVICE_FIELDS}
      reviews { ${REVIEW_FIELDS} }
    }
  }
`;

export const GET_SERVICE_BY_ID_QUERY = `
  query GetServiceById($id: ID!) {
    marketplaceServiceById(id: $id) {
      ${SERVICE_FIELDS}
      reviews { ${REVIEW_FIELDS} }
    }
  }
`;

export const CREATE_MARKETPLACE_SERVICE_MUTATION = `
  mutation CreateMarketplaceService($input: CreateMarketplaceServiceInput!) {
    createMarketplaceService(input: $input) {
      ${SERVICE_FIELDS}
    }
  }
`;

export const UPDATE_MARKETPLACE_SERVICE_MUTATION = `
  mutation UpdateMarketplaceService($storeId: ID!, $serviceId: ID!, $input: UpdateMarketplaceServiceInput!) {
    updateMarketplaceService(storeId: $storeId, serviceId: $serviceId, input: $input) {
      ${SERVICE_FIELDS}
    }
  }
`;

export const DELETE_MARKETPLACE_SERVICE_MUTATION = `
  mutation DeleteMarketplaceService($storeId: ID!, $serviceId: ID!) {
    deleteMarketplaceService(storeId: $storeId, serviceId: $serviceId)
  }
`;

export const ADD_SERVICE_REVIEW_MUTATION = `
  mutation AddServiceReview($input: CreateServiceReviewInput!) {
    addServiceReview(input: $input) {
      ${REVIEW_FIELDS}
    }
  }
`;

/**
 * Paginated product search query — supports server-side category filtering.
 */
export const GET_PRODUCTS_PAGINATED_QUERY = `
  query GetProducts(
    $where: ProductWhereInput
    $page: Int
    $limit: Int
  ) {
    products(where: $where, page: $page, limit: $limit) {
      items {
        id
        ownerUid
        productName
        imageurl {
          ref
          url
        }
        imageUrlMulti {
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
      pagination {
        page
        limit
        totalCount
        hasNextPage
      }
    }
  }
`;

