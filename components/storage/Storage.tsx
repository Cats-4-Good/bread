import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const storage = new Storage({
  size: 1,
  storageBackend: AsyncStorage, // for web: window.localStorage
  defaultExpires: null,
  enableCache: true,
  sync: {},
});

interface User {
  username: string;
  id: string;
};

export const useUser = (): [User | undefined, () => void] => {
  const [user, setUser] = useState<User>();
  const [shouldRefresh, setShouldRefresh] = useState(true);

  useEffect(() => {
    if (!shouldRefresh) return;
    storage
      .load({
        key: "user",
        autoSync: true,
        syncInBackground: true,
      })
      .then((res) => {
        setUser(res);
        setShouldRefresh(false);
        console.log(res.username);
      })
      .catch((err) => {
        console.log(err.message);
        setShouldRefresh(false);
      });
  }, [shouldRefresh]);

  const refresh = () => setShouldRefresh(true);

  return [user, refresh];
}

export default storage;
