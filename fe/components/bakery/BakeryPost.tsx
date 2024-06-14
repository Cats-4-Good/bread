import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";

export interface Listing {
  name: string;
  price: string;
  datetime: string;
  description: string;
  quantity?: {
    min: number;
    max: number;
  };
  image?: string;
}

export default function BakeryPost({ item }: { item: Listing }) {
  return (
    <View style={styles.listItem}>
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      <View style={styles.listItemTextContainer}>
        <View style={styles.listHeader}>
          <TouchableWithoutFeedback
            onPress={() => {
              // todo
            }}
          >
            <View style={styles.listItemProfile}>
              <MaterialIcons name="person" size={16} color="black" />
            </View>
          </TouchableWithoutFeedback>
          <ThemedText type="default">{item.datetime}</ThemedText>
        </View>

        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText type="default" style={styles.listItemDescriptionText}>
          {item.description}
        </ThemedText>

        <View style={styles.listFooter}>
          <ThemedText type="defaultSemiBold">{item.price}</ThemedText>
          {item.quantity && (
            <ThemedText type="default">
              {item.quantity.min.toString() +
                "-" +
                item.quantity.max.toString() +
                " left"}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    padding: 18,
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
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  listItemImage: {
    width: "40%",
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
  listItemDescriptionText: {
    paddingVertical: 4,
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
});
