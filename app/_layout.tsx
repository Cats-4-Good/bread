import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { initializeApp } from "firebase/app";
import RegisterScreen from "@/components/fake-auth/register";
import { useUser } from "@/hooks";

const firebaseConfig = {
  apiKey: "AIzaSyBnyCgXhkgDBr0WXQWisQ1m6HRW00RN1Qg",
  authDomain: "crumbs-31f1e.firebaseapp.com",
  projectId: "crumbs-31f1e",
  storageBucket: "crumbs-31f1e.appspot.com",
  messagingSenderId: "640758945649",
  appId: "1:640758945649:web:8d3803180c75c90eb108d0",
  measurementId: "G-M3M7V2DBZ7"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  // load user data from storage
  const [loaded] = useFonts({
    Inter: require("@/assets/fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const [user, _setUser] = useUser();

  if (!loaded) {
    return null;
  }

  if (!user) {
    return <RegisterScreen />;
  }

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
    </ThemeProvider>
  );
}
