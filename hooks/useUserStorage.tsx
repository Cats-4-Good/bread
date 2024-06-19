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
  const [shouldRefresh, setShouldRefresh] = useState(true);

  useEffect(() => {
    if (!shouldRefresh) return;
    setShouldRefresh(false);
    storage
      .load({
        key: "user",
        autoSync: true,
        syncInBackground: true,
      })
      .then((res: UserStorage | null) => {
        setUserStorage(res);
        if (!res) console.log("No user stored");
        else console.log(`Loaded id ${res.id} ${res.username} from storage`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [shouldRefresh]);

  const updateUserStorage = async (id: string, username: string) => {
    const data: UserStorage = { id, username };
    await storage.save({
      key: "user",
      data,
    });
    setUserStorage(null);
    setShouldRefresh(true);
  };

  const logOut = async () => {
    // remove user data from storage
    await storage.remove({
      key: "user",
    });
    setUserStorage(null);
  };

  return [userStorage, updateUserStorage];
};
