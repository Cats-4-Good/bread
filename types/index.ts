export interface GoogleListing { // refers to google maps listing
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

export interface User {
  id: string;
  name: string;
  totalViews: number;  // (all these total are the aggregate amounts they've received from all posts)
  totalMunches: number;
  totalFoodSaved: number;
  lastMunch: {
    postId: string;
    time: string;
  } | null;
}


