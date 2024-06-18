import { Listing } from "./BakeryPost";

export const listings: Listing[] = [
  {
    name: "Croissant",
    price: "1 for $1",
    datetime: "45 mins ago",
    description: "Bread is my life. i will die 1 day without bread :3",
    quantity: {
      min: 10,
      max: 20,
    },
    image: "@/assets/images/croissant.jpg",
  },
  {
    name: "Baguette",
    price: "$3.00",
    datetime: "3 hours ago",
    description: "Bread is my life. i will die 1 day without bread :3",
    image: "@/assets/images/floss.jpg",
  },
];
