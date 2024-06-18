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
import RegisterScreen from "@/components/fake-auth/register";
import { useUser } from "@/hooks";
import { View, Text, StyleSheet } from "react-native";
import { ThemedButton } from "@/components";
import Modal from "react-native-modal";

const firebaseConfig = {
  apiKey: "AIzaSyBnyCgXhkgDBr0WXQWisQ1m6HRW00RN1Qg",
  authDomain: "crumbs-31f1e.firebaseapp.com",
  projectId: "crumbs-31f1e",
  storageBucket: "crumbs-31f1e.appspot.com",
  messagingSenderId: "640758945649",
  appId: "1:640758945649:web:8d3803180c75c90eb108d0",
  measurementId: "G-M3M7V2DBZ7",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  // this font shit still doesn't work
  const [loaded] = useFonts({ Inter: require("@/assets/fonts/Inter-Regular.ttf") });
  const [user, _setUser] = useUser();
  const [showMunchResponse, setShowMunchResponse] = useState(false);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    // check every 10 seconds if their last munch time was at least 15 mins ago
    const interval = setInterval(() => {
      if (!user?.lastMunch?.time) return;
      const curTime = Date.now();
      const elapsed = curTime - parseInt(user.lastMunch.time);
      const secondsElapsed = Math.floor(elapsed / 1000);
      const minMinutesAgo = 15;
      if (minMinutesAgo * 60 <= secondsElapsed) {
        setShowMunchResponse(true);
      }
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) return null;
  if (!user) return <RegisterScreen />;

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
          name="favourite"
          options={{
            title: "Favourite",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "star" : "star-outline"}
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
        isVisible={showMunchResponse}
        onBackdropPress={() => setShowMunchResponse(false)}
        hasBackdrop
      >
        <View style={[styles.modalView, { alignItems: "center", gap: 10 }]}>
          <View style={{ alignItems: "center", gap: 6 }}>
            <Text style={styles.modalTitle}>Post published</Text>
            <Text style={[styles.modalText, { fontWeight: "300" }]}> </Text>
          </View>
          <View style={styles.topContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === "list"
                  ? styles.buttonSelected
                  : styles.buttonUnselected,
              ]}
              onPress={() => setSelectedButton("list")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === "list" && styles.buttonTextSelected,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === "map"
                  ? styles.buttonSelected
                  : styles.buttonUnselected,
              ]}
              onPress={() => setSelectedButton("map")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === "map" && styles.buttonTextSelected,
                ]}
              >
                Map
              </Text>
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
    gap: 14,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
});
