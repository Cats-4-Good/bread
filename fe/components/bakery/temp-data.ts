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
    image:
      "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Baguette",
    price: "$3.00",
    datetime: "3 hours ago",
    description: "Bread is my life. i will die 1 day without bread :3",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOQpMd1VvFulMmL5eZzbby_LtusqbLCivDZA&s",
  },
];
