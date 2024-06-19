export interface GoogleListing {
  // refers to google maps listing
  name: string;
  location: string;
  status: string;
  lat: number;
  lng: number;
  place_id: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  htmlAttributions: string[];
  photoReferences: string[];
  image?: string;
  distance: number;
}

export interface Bakery {
  id: string; // this will be place id from google listing
  listing: GoogleListing;
  stats?: BakeryStats;
}

// BELOW ARE SIMILAR SCHEMAS FOR FIRESTORE
export interface BakeryStats {
  livePostsCount: number;
  totalPosts: number;
}

export interface Post {
  id: string;
  bakeryName: string; // when view user profile, should show bakery name of each post
  bakeryId: string; // so this is place id
  uid: string; // uid here for future when want to click to go to poster's profile
  username: string; // will be inaccurate if user can change name but dc
  createdAt: string;
  isLive: boolean; // used to mark if deducted from bakery's livePostsCount alr
  image?: string | null;
  description?: string | null;
  views: number;
  munches: number;
  foodSaved: number;
}

export interface UserStorage {
  id: string;
  username: string;
}

export interface User {
  id: string;
  username: string;
  totalViews: number; // (all these total are the aggregate amounts they've received from all posts)
  totalMunches: number;
  totalFoodSaved: number;
  lastMunch: {
    postId: string;
    time: string;
  } | null;
  munchedPostIds: string[]; // in firestore this will be a collection of all postIds, but in state will be empty array that will be populated with postids whenever user munches
  // also can use set for this but nah
}
