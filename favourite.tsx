import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components";

export default function FavouriteScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="default">This is my favourite page</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
