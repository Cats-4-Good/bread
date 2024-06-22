import { useEffect, useState } from "react";

// OLD
// const GOOGLE_API = "AIzaSyBo-YlhvMVibmBKfXKXuDVf--a92s3yGpY";

// NEW
const GOOGLE_API = "AIzaSyCVJO8VtUL7eZ9dsvB_mHl8q_aPzPR1v5g";

interface PicturesCache {
  [id: string]: string;
};
export const useGooglePicture = (bakeryId: string, photoReference?: string) => {
  const [pictures, setPictures] = useState<PicturesCache>({});
  //* Convert blob to base64 for image
  const blobToData = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject("fml");
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    // comment out to reduce api calls for now...
    (async () => {
      if (!photoReference || pictures[bakeryId]) return;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API}`
        );
        const blob = await response.blob();
        const image = (await blobToData(blob)) as string;
        setPictures({
          ...pictures,
          [bakeryId]: image
        });
      } catch {
        console.log("failed to get picture");
      }
    })();
  }, [bakeryId, photoReference]);

  return pictures[bakeryId] ?? "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg";
};

