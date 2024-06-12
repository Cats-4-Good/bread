import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.tint,
          headerShown: true,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="favourite"
          options={{
            title: "Favourite",
            tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "star" : "star-outline"} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index" // this is map, will have routing for bakery screen
          options={{
            title: "Crumbs",
            tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="bakery/[slug]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
