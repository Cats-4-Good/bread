import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "@/types";
import { Unsubscribe, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import * as Device from "expo-device";

const deviceNameToId: { [deviceName: string]: string } = {
  "2201117TG": "0",
  "iPhone 14 Pro": "1",
  "iPhone 12": "2",
  "iPhone 14": "3",
  "iPhone 11 Pro": "4"
};

const idToName: { [id: string]: string } = {
  "0": "Justin",
  "1": "Jessica",
  "2": "Rui Heng",
  "3": "Guan Quan",
  "4": "Brian",
}

export const useUser = (): [
  User | null,
  setUser: Dispatch<SetStateAction<User | null>>,
] => {
  const [user, setUser] = useState<User | null>(null);
  const db = getFirestore();

  useEffect(() => {
    let unsub: Unsubscribe | undefined;
    async function run() {
      console.log(Device.modelName);
      const id = Device.modelName ? (deviceNameToId[Device.modelName] ?? "-1") : "-1";
      const userRef = doc(db, "users", id);
      // i think it might be subscribing multiple times but idts also?
      unsub = onSnapshot(userRef, async (doc) => {
        if (!doc.exists()) {
          // create user if don't exist
          const defaultUser: Omit<User, "id" | "munchedPostIds"> = {
            username: idToName[id] ?? "Bob",
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
            username: id,
            munchedPostIds: user?.munchedPostIds ?? [], // keep existing munches
            ...(doc.data() as Omit<User, "id" | "munchedPostIds" | "username">),
          } as User;
          setUser(data);
        }
      });
    }
    run();
    return () => unsub && unsub();
  }, []);
  return [user, setUser];
};
