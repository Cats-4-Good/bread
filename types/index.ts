export interface Post {
  id: string;
  bakeryId: string;
  image: string | null;
  description: string;
  views: number;
  munches: number;
  foodSaved: number;
}
