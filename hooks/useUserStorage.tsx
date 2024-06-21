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
  { remove: () => Promise<void>, save: (data: UserStorage) => Promise<void> }
] => {
  const [userStorage, setUserStorage] = useState<UserStorage | null>(null);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const load = async () => {
    try {
      const res: UserStorage | null = await storage
        .load({
          key: "user",
          autoSync: true,
          syncInBackground: true,
        })
      setUserStorage(res);
      if (!res) console.log("No user stored");
      else console.log(`Loaded id ${res.id} ${res.username} from storage`);
      console.log(userStorage);
    } catch (err) {
      console.log(err);
    };
  };

  const remove = async () => {
    // remove user data from storage
    await storage.remove({
      key: "user",
    });
    setUserStorage(null);
    console.log("removed");
  };

  const save = async (data: UserStorage) => {
    await storage.save({
      key: "user",
      data,
    });
    await load();
  };

  return [userStorage, { save, remove }];
};
