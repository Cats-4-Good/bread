import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "@/types";
import { Unsubscribe, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import * as Device from "expo-device";

const deviceNameToId: { [deviceName: string]: string } = {
  "Redmi Note 11": "0",
};

const idToName: { [id: string]: string } = {
  "0": "Justin"
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
      const id = Device.deviceName ? (deviceNameToId[Device.deviceName] ?? "-1") : "-1";
      const userRef = doc(db, "users", id);
      // i think it might be subscribing multiple times but idts also?
      unsub = onSnapshot(userRef, async (doc) => {
        if (!doc.exists()) {
          // create user if don't exist
          const defaultUser: Omit<User, "id" | "munchedPostIds"> = {
            username: idToName[id] ?? "Brian",
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
