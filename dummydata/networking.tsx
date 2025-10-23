export const vehicleCategories = [
  {
    id: 1,
    title: "Sedans",
    image: "/images/category/sedan.webp",
  },
  {
    id: 2,
    title: "Hatchbacks",
    image: "/images/category/hatchback.webp",
  },
  {
    id: 3,
    title: "OffRoad",
    image: "/images/category/offroad.webp",
  },
  {
    id: 4,
    title: "Super-Cars",
    image: "/images/category/supercar.webp",
  },
  {
    id: 5,
    title: "Bikes",
    image: "/images/category/classic.webp",
  },
  {
    id: 6,
    title: "Superbikes",
    image: "/images/category/superbike.webp",
  },
];
export type CategoryType =
  | "sedans"
  | "hatchbacks"
  | "offroad"
  | "super-cars"
  | "bikes"
  | "electric-bikes"
  | "superbikes"
  | "cruisers";

export type Club = {
  id: string;
  name: string;
  categoryType: CategoryType;
  image: string;
  location: string;
  memberCount: number;
  description: string;
  createdBy: string;
};

export const clubs: Club[] = [
  {
    id: "s1",
    name: "Cityline Sedan Society",
    categoryType: "sedans",
    image: "/images/category/offroad.webp",
    location: "San Francisco, CA",
    memberCount: 214,
    description:
      "For folks who love comfy long drives, clean builds and OEM+ mods.",
    createdBy: "Amelia Hart",
  },
  {
    id: "s2",
    name: "German Executive Crew",
    categoryType: "sedans",
    image: "/images/category/supercar.webp",

    location: "Chicago, IL",
    memberCount: 142,
    description:
      "BMW/Audi/Merc fans sharing maintenance tips and roadtrip routes.",
    createdBy: "Kevin Luo",
  },
  {
    id: "h1",
    name: "Compact Hatch Collective",
    categoryType: "hatchbacks",
    image: "/images/category/offroad.webp",

    location: "Austin, TX",
    memberCount: 318,
    description: "Hot hatches, track days and coffee runs. All trims welcome.",
    createdBy: "Rita Gomez",
  },
  {
    id: "o1",
    name: "Trail Off Roaders",
    categoryType: "offroad",
    image: "/images/category/hatchback.webp",

    location: "Flagstaff, AZ",
    memberCount: 501,
    description: "Weekend trail meets, recovery training and campsite swaps.",
    createdBy: "Trevor Miles",
  },
  {
    id: "sc1",
    name: "V12-Espresso",
    categoryType: "super-cars",
    image: "/images/category/sedan.webp",

    location: "Miami, FL",
    memberCount: 89,
    description: "Curated drives, detail clinics, charity rallies.",
    createdBy: "Sophia Rossi",
  },
  {
    id: "b1",
    name: "Urban Riders Moto",
    categoryType: "bikes",
    image: "/images/category/offroad.webp",

    location: "Portland, OR",
    memberCount: 267,
    description: "Cafe racers to scramblers — wrench nights each month.",
    createdBy: "Nate Carter",
  },
  // {
  //   id: "b2",
  //   name: "Gost Riders Moto",
  //   categoryType: "bikes",
  //   image: "/images/category/offroad.webp",

  //   location: "Portland, OR",
  //   memberCount: 267,
  //   description: "Cafe racers to scramblers — wrench nights each month.",
  //   createdBy: "Nate Carter",
  // },
  // {
  //   id: "eb1",
  //   name: "E Bike Explorers",
  //   categoryType: "electric-bikes",
  //   image: "/images/category/offroad.webp",

  //   location: "Seattle, WA",
  //   memberCount: 194,
  //   description: "Urban commutes, trail etiquette and battery care.",
  //   createdBy: "Dana Price",
  // },
  // {
  //   id: "sb1",
  //   name: "Superbike-Syndicate",
  //   categoryType: "superbikes",
  //   image: "/images/category/offroad.webp",

  //   location: "Los Angeles, CA",
  //   memberCount: 356,
  //   description: "Track days, gear swaps and safety briefings.",
  //   createdBy: "Luca Marino",
  // },
  // {
  //   id: "c1",
  //   name: "Blacktop Cruisers",
  //   categoryType: "cruisers",
  //   image: "/images/category/offroad.webp",

  //   location: "Nashville, TN",
  //   memberCount: 221,
  //   description: "Low and loud. Slow rolls and BBQ meetups.",
  //   createdBy: "Harper King",
  // },
];

interface EventItem{
  id:string;
  title:string;
  image:string;
  hostedBy:string;
  slotsAvailable:number;
  totalSlots:number;
  date:string;
  description:string;
  category:string;
  rating:number
  startTime:string;
  location:string;
  invitedClubs:string[];
}

export const events: EventItem[] = [
  {
    id: 'ev1',
    title: 'Sunset Drift Meetup',
    image: "/images/category/offroad.webp",
    hostedBy: 'Karachi Auto Club',
    slotsAvailable: 18,
    totalSlots: 30,
    date: '2025-10-05',
    startTime: '17:30',
    location: 'Port Grand, Karachi',
    invitedClubs: ['Redline Racers', 'Highway Hounds', 'Turbo Titans', 'The Apex Society', 'Night Owls Garage'],
    description: 'An exciting drift meetup at sunset along Karachi’s port with food stalls and live music.',
    category: 'Drifting',
    rating: 4.5,
  },
  {
    id: 'ev2',
    title: 'Vintage & Classics Showcase',
    image: "/images/category/offroad.webp",
    hostedBy: 'Vintage Wheels Pakistan',
    slotsAvailable: 9,
    totalSlots: 20,
    date: '2025-11-12',
    startTime: '11:00',
    location: 'Frere Hall, Karachi',
    invitedClubs: ['Classic Cruisers', 'Chrome & Coffee', 'Old Timers Guild', 'Retro Riders'],
    description: 'Showcase of rare classic cars and vintage beauties at the historic Frere Hall.',
    category: 'Vintage',
    rating: 5,
  },
  {
    id: 'ev3',
    title: '4x4 Trail & BBQ',
    image: "/images/category/offroad.webp",
    hostedBy: 'Desert Fox Offroad',
    slotsAvailable: 25,
    totalSlots: 40,
    date: '2025-12-03',
    startTime: '08:00',
    location: 'Gadani Trails',
    invitedClubs: ['Mud Masters', 'Trail Blazers', 'Torque Tribe', 'SandStormers', 'Overland Collective'],
    description: 'Off-road adventure through rugged Gadani trails, ending with a BBQ feast.',
    category: 'Offroad',
    rating: 4,
  },
];
