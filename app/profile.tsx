import { StyleSheet, View } from "react-native";

import storage from "@/components/storage/Storage";
import { ThemedText } from "@/components";
import { ThemedButton } from "@/components/ThemedButton";

export default function ProfileScreen() {
  const logoutHandler = () => {
    console.log("Logging out...");

    // remove user data from storage
    storage.remove({
      key: "user",
    });

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
