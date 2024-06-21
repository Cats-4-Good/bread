import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { UserStorage, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Unsubscribe, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useFocusEffect } from "expo-router";

export const useUser = (): [
  User | null,
  {
    setUser: Dispatch<SetStateAction<User | null>>,
    setUserStorage: (value: UserStorage | null) => Promise<void>,
  }
] => {
  const [user, setUser] = useState<User | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const db = getFirestore();

  useFocusEffect(useCallback(() => {
    let unsub: Unsubscribe | undefined;
    async function run() {
      if (!shouldRefresh) return;
      const userStorage = await getData();
      if (!userStorage) {
        setUser(null);
        setShouldRefresh(false);
        return;
      }
      const userRef = doc(db, "users", userStorage.id);
      // i think it might be subscribing multiple times but idts also?
      unsub = onSnapshot(userRef, async (doc) => {
        console.log("inside subscription");
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
            console.log("set");
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
          console.log("set user2");
          setUser(data);
          setShouldRefresh(false);
        }
      });
    }
    run();
    return () => unsub && unsub();
  }, [shouldRefresh]));

  const getData = async (): Promise<UserStorage | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("failed to get userstorage");
    }
    return null;
  };

  const storeData = async (value: UserStorage | null) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('user', jsonValue);
      console.log("storedata called");
      setShouldRefresh(true);
    } catch (e) {
      console.log("failed to set userstorage");
    }
  };
  return [user, { setUser, setUserStorage: storeData }];
};
