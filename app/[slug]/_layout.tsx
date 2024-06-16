import { Stack, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => {
          const { slug } = useLocalSearchParams();
          return <Text style={{ fontSize: 20 }}>{slug}</Text>;
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity onPress={router.back} style={{}}>
            <Ionicons name="chevron-back" size={30} />
          </TouchableOpacity>
        ),
        headerBackVisible: false,
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
    </Stack>
  );
}
