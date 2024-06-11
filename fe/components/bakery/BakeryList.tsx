import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import BakeryPost from "./BakeryPost";
import { listings } from "./temp-data";

export default function BakeryList() {
  return (
    <View style={styles.content}>
      <Image
        source={{
          uri: "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg",
        }}
        style={styles.bakeryImage}
      />
      <View>
        <TouchableOpacity style={styles.newPostButton} onPress={() => { }}>
          <Text style={styles.newPostButtonText}>
            New Post <Entypo name="plus" size={16} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={listings}
        renderItem={({ item }) => <BakeryPost item={item} />}
        keyExtractor={(_, index) => index.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    height: "100%",
    backgroundColor: "#feedd3",
  },
  bakeryImage: {
    width: "100%",
    aspectRatio: 2,
    maxHeight: 200,
  },
  newPostButton: {
    backgroundColor: "#CF9C61",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  newPostButtonText: {
    color: "white",
    fontSize: 16,
  },
  list: {
    width: "auto",
    marginHorizontal: 20,
  },
});
