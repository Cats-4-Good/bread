import { View, StyleSheet, TouchableWithoutFeedback, Image } from "react-native";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { Post } from "@/types";
import { ThemedButton } from "../ThemedButton";

export default function BakeryPost({ item }: { item: Post }) {
  const getTimeAgo = (epochTime: string): string => {
    const currentTime = Date.now();
    const elapsed = currentTime - parseInt(epochTime);

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.listHeader}>
        <View style={styles.profileAndTimeContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              // todo
            }}
          >
            <View style={styles.listItemProfile}>
              <ThemedText type="small">{item.username.slice(0, 2).toUpperCase()}</ThemedText>
            </View>
          </TouchableWithoutFeedback>
          <ThemedText type="default" style={styles.timeText}>
            {getTimeAgo(item.createdAt)}
          </ThemedText>
        </View>
        <ThemedButton type="primary" style={styles.munchButton}>
          Munch!
        </ThemedButton>
      </View>
      {item.image && <Image source={{ uri: `${item.image}` }} style={styles.listItemImage} />}
      <ThemedText type="defaultSemiBold" style={styles.munches}>
        {item.munches} bread lovers have munched this
      </ThemedText>
      <ThemedText type="default">{item.description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 15,
    shadowOffset: { height: 3, width: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  listItemProfile: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: Colors.grayLight,
    borderWidth: 1,
    backgroundColor: Colors.darkPink,
  },
  listItemImage: {
    width: "100%",
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 15,
    borderColor: Colors.grayLight,
    borderWidth: 1,
  },
  listItemTextContainer: {
    width: "60%",
    padding: 2,
  },
  listFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  listHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  profileAndTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 8,
  },
  munches: {
    color: Colors.gray,
  },
  munchButton: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 15,
  },
});
