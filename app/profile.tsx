import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components";
import { ThemedButton } from "@/components/ThemedButton";

export default function ProfileScreen() {
  const logoutHandler = () => {
    console.log("Logging out...");
    // TODO
    // redirect to login screen
  };

  return (
    <View>
      <ThemedText type="default">This is my profile page</ThemedText>
      <ThemedButton
        type="primary"
        onPress={logoutHandler}
        style={{ marginTop: 20, width: 150 }}
      >
        Logout
      </ThemedButton>
    </View>
  );
}

const styles = StyleSheet.create({});