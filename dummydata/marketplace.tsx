export type markeptlaceType = {
  id: number;
  shopName: string;
  image: string;
};
export const markeptlaceCatgegoryies: markeptlaceType[] = [
  {
    id: 1,
    shopName: "Segal Motors",
    image: "/images/logos/segalmotors.jpg",
  },
  {
    id: 2,
    shopName: "Ga auto PK",
    image: "/images/logos/gaAuto.png",
  },
  {
    id: 3,
    shopName: "Pak Wheels Auto Store",
    image: "/images/logos/pakwheels.jpg",
  },
  {
    id: 4,
    shopName: "Index Helmets PK",
    image: "/images/logos/indexHelmentlogo.png",
  },
  {
    id: 5,
    shopName: "Ls2 helments PK",
    image: "/images/logos/ls2.jpeg",
  },
];

export type marketplaceProductType = {
  id: number;
  productName: string;
  image: string;
  profileName?: string;
  price: number;
};
export const marketplaceProducts: marketplaceProductType[] = [
  {
    id: 1,
    productName: "Racing Helmet",
    image: "/images/logos/ls2Helment.jpeg",
    profileName: "LS2 Helmets PK",

    price: 21500,
  },
  {
    id: 2,
    productName: "Brv Roof Cage",
    image: "/images/logos/brv.jpeg",
    profileName: "Segal Motors",

    price: 30500,
  },
  {
    id: 3,
    productName: "Bike grips",
    image: "/images/logos/bikeGrips.jpeg",
    profileName: "Ga auto PK",
    price: 300,
  },
  {
    id: 4,
    productName: "Index Helment",
    image: "/images/logos/indexHelemnt.jpeg",
    profileName: "Index Helmets PK",
    price: 12680,
  },
  {
    id: 5,
    productName: "Civic Side Mirror",
    image: "/images/logos/sidemiror.webp",
    profileName: "Segal Motors",
    price: 5000,
  },
];
