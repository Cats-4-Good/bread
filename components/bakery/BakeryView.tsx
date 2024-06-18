import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { GoogleListing } from "@/types";
import { router } from "expo-router";

export default function BakeryView({ item }: { item: GoogleListing }) {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: `/${item?.name}`,
          params: { ...item },
        });
      }}
    >
      <View style={styles.listItem}>
        <Image
          source={{
            uri: `${item.image
              ? item.image
              : "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg"
              }`,
          }}
          style={styles.listItemImage}
        />
        <View style={styles.listItemTextContainer}>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText type="default">{item.vicinity}</ThemedText>
          <ThemedText type="default">{item.status}</ThemedText>
          <ThemedText type="default">
            {"~"}
            {item.distance}m away
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    padding: 13,
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 15,
    shadowOffset: { height: 3, width: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  listItemImage: {
    width: "35%",
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 15,
    borderColor: Colors.grayLight,
    borderWidth: 1,
  },
  listItemTextContainer: {
    width: "65%",
    padding: 2,
  },
});
