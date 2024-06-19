import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { Bakery } from "@/types";
import { router } from "expo-router";

export default function BakeryView({ bakery }: { bakery: Bakery }) {
  const { listing, stats } = bakery;
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
          <ThemedText type="subtitle" numberOfLines={1}>{listing.name}</ThemedText>
          <ThemedText type="default" style={{ color: Colors.gray }} numberOfLines={1}>{listing.vicinity}</ThemedText>
          <ThemedText type="default" style={{
            color: listing.status === "CLOSED_TEMPORARILY"
              ? Colors.red
              : (listing.status === "OPERATIONAL"
                ? Colors.green
                : "#000")
          }}>
            {listing.status === "CLOSED_TEMPORARILY"
              ? "CLOSED"
              : (listing.status === "OPERATIONAL"
                ? "OPEN"
                : listing.status)}
          </ThemedText>
          <ThemedText type="default">~{listing.distance}m away</ThemedText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 10 }}>
            <ThemedText type="default" style={{ fontSize: 17, fontWeight: "bold" }}>{Math.max(0, stats?.livePostsCount ?? 0)}</ThemedText>
            <ThemedText type="default"> live lobangs</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity >
  );
  // <View>
  //   <ThemedText type="default">{stats?.livePostsCount ?? 0} live posts</ThemedText>
  //   <ThemedText type="default">{stats?.totalPosts ?? 0} total posts</ThemedText>
  // </View>
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    backgroundColor: Colors.white,
    alignItems: "center",
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
    gap: 4,
  },
});
