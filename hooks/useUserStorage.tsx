import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { UserStorage } from "@/types";

const storage = new Storage({
  size: 1,
  storageBackend: AsyncStorage, // for web: window.localStorage
  defaultExpires: null,
  enableCache: true,
  sync: {},
});

export const useUserStorage = (): [
  UserStorage | null,
  (id: string, username: string) => Promise<void>,
] => {
  const [userStorage, setUserStorage] = useState<UserStorage | null>(null);

  useEffect(() => {
    storage
      .load({
        key: "user",
        autoSync: true,
        syncInBackground: true,
      })
      .then((res) => {
        setUserStorage(res);
        console.log(res.username);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [userStorage]);

  const updateUserStorage = async (id: string, username: string) => {
    const data: UserStorage = { id, username };
    await storage.save({
      key: "user",
      data,
    });
    setUserStorage(null);
  };

  return [userStorage, updateUserStorage];
};
