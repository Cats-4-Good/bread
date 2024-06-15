import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [loaded] = useFonts({
    Inter: require("@/assets/fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
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
          name="login"
          options={{
            title: "Login",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "log-in" : "log-in-outline"}
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
