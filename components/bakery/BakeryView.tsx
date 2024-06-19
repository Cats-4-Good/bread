import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { Bakery, GoogleListing } from "@/types";
import { router } from "expo-router";

export default function BakeryView({ bakery }: { bakery: GoogleListing }) {
  // const { listing, stats } = bakery;
  const listing = bakery;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: `/${listing?.name}`,
          params: { ...listing },
        });
      }}
    >
      <View style={styles.listItem}>
        <Image
          source={{
            uri: `${listing.image
              ? listing.image
              : "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg"
              }`,
          }}
          style={styles.listItemImage}
        />
        <View style={styles.listItemTextContainer}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>{listing.name}</ThemedText>
          <ThemedText type="default" numberOfLines={1}>{listing.vicinity}</ThemedText>
          <ThemedText type="default">{listing.status === "CLOSED_TEMPORARILY" ? "CLOSED" : (listing.status === "OPERATIONAL" ? "OPEN" : listing.status)}</ThemedText>
          <ThemedText type="default">~{listing.distance}m away</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
  // <View>
  //   <ThemedText type="default">{stats?.livePostsCount ?? 0} live posts</ThemedText>
  //   <ThemedText type="default">{stats?.totalPosts ?? 0} total posts</ThemedText>
  // </View>
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    padding: 13,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    backgroundColor: Colors.white,
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
    padding: 6,
  },
});
