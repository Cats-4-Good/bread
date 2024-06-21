import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { initializeApp } from "firebase/app";
import { useUser } from "@/hooks";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { Post } from "@/types";
import { doc, getDoc, getFirestore, increment, updateDoc } from "firebase/firestore";
import BakeryPost from "@/components/bakery/BakeryPost";

const firebaseConfig = {
  apiKey: "AIzaSyBnyCgXhkgDBr0WXQWisQ1m6HRW00RN1Qg",
  authDomain: "crumbs-31f1e.firebaseapp.com",
  projectId: "crumbs-31f1e",
  storageBucket: "crumbs-31f1e.appspot.com",
  messagingSenderId: "640758945649",
  appId: "1:640758945649:web:8d3803180c75c90eb108d0",
  measurementId: "G-M3M7V2DBZ7",
};

const _app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  // this font shit still doesn't work
  const [loaded] = useFonts({ Inter: require("@/assets/fonts/Inter-Regular.ttf") });
  const [user, _] = useUser();
  const [rejected, setRejected] = useState(false);
  const [lastMunchPost, setLastMunchPost] = useState<Post | null>(null);
  const db = getFirestore();

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  const checkLastMunch = async () => {
    if (!user?.lastMunch || lastMunchPost || rejected) return;
    const curTime = Date.now();
    const elapsed = curTime - user.lastMunch.time;
    const secondsElapsed = Math.floor(elapsed / 1000);
    const minMinutesAgo = 0.1; // CHANGE THIS IN FUTURE
    if (minMinutesAgo * 60 <= secondsElapsed) {
      const postRef = doc(db, "posts", user.lastMunch.postId);
      try {
        const res = await getDoc(postRef);
        const data = {
          id: res.id,
          ...res.data(),
        } as Post;
        setLastMunchPost(data);
      } catch (err) {
        console.log("Failed to get last munch post", err);
      }
    }
  };

  useEffect(() => {
    // check if their last munch time was at least some mins ago
    // interval used for case when user is on app the entire time
    const interval = setInterval(checkLastMunch, 1000);
    return () => clearInterval(interval);
  }, [user?.lastMunch]);

  const handleSuccess = async () => {
    if (!user?.lastMunch) return;
    const postRef = doc(db, "posts", user.lastMunch.postId);
    const userRef = doc(db, "users", user.id);
    const posterRef = doc(db, "users", user.lastMunch.posterId);
    try {
      await Promise.all([
        updateDoc(postRef, { foodSaved: increment(1) }), // update post
        updateDoc(userRef, { userFoodSaved: increment(1), lastMunch: null }), // update user
        updateDoc(posterRef, { postsFoodSaved: increment(1) }), // update poster
      ]);
      setLastMunchPost(null);
      console.log("hello");
    } catch (err) {
      console.log("Failed rejection remove user last munch", err);
    }
  };

  const handleReject = async () => {
    setRejected(true);
    setLastMunchPost(null);
    if (!user?.lastMunch) return;
    const userRef = doc(db, "users", user.id);
    try {
      await updateDoc(userRef, { lastMunch: null });
    } catch (err) {
      console.log("Failed rejection remove user last munch", err);
    }
  };

  if (!loaded) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.secondary,
          headerShown: false, // think header false for now, cos only need header for bakery, will use stack
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen // put map on the left of tab bar because when back button pressed on android it goes to the first tab in tab bar, this is lazy fix unless need home to be centred
          name="index" // this is map, will have routing for bakery screen
          options={{
            title: "Crumbs",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="[slug]"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <Modal
        isVisible={!!lastMunchPost}
        onBackdropPress={handleReject}
        hasBackdrop
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Did you purchase this item you munched on?</Text>
          {lastMunchPost && <BakeryPost post={lastMunchPost} showBakeryName />}
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={handleSuccess}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleReject}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemeProvider >
  );
};

const styles = StyleSheet.create({
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 340,
    paddingTop: 20,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden", // for buttons
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 20,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
  },
  buttonView: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.grayLight,
    borderWidth: 1,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.accentDark,
  },
});
