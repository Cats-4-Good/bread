import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "@/types";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useUserStorage } from "./useUserStorage";

export const useUser = (): [
  User | null,
  Dispatch<SetStateAction<User | null>>,
] => {
  const [userStorage, _] = useUserStorage();
  const [user, setUser] = useState<User | null>(null);
  const db = getFirestore();

  useEffect(() => {
    console.log(userStorage);
    if (!userStorage) return;
    const userRef = doc(db, "users", userStorage.id);
    // i think it might be subscribing multiple times but idts also?
    const unsubscribe = onSnapshot(userRef, async (doc) => {
      if (!doc.exists()) {
        // create user if don't exist
        const defaultUser: Omit<User, "id" | "munchedPostIds"> = {
          username: userStorage.username,
          totalViews: 0,
          userMunches: 0,
          userFoodSaved: 0,
          postsMunches: 0,
          postsFoodSaved: 0,
          lastMunch: null,
        };
        try {
          await setDoc(userRef, defaultUser);
        } catch (err) {
          console.error("failed to create default user in firestore", err);
        }
      } else {
        // sync user hook with firestore
        const data = {
          id: doc.id,
          username: userStorage.username,
          munchedPostIds: user?.munchedPostIds ?? [], // keep existing munches
          ...(doc.data() as Omit<User, "id" | "munchedPostIds" | "username">),
        } as User;
        setUser(data);
      }
    });
    return unsubscribe;
  }, [userStorage]);

  return [user, setUser];
};
