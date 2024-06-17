import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import BakeryPost from "@/components/bakery/BakeryPost";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Modal from "react-native-modal";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedButton } from "@/components";
import { Post } from "@/types";

export default function BakeryPosts() {
  const [modalVisible, setModalVisible] = useState(false);
  const { vicinity, slug, status, place_id } = useLocalSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const API_URL = "xxx/api";

      try {
        const response = await fetch(`${API_URL}`);
        console.log(response)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  return (
    <View style={styles.content}>
      <Image
        source={{
          uri: "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg",
        }}
        style={styles.bakeryImage}
      />
      <View>
        <TouchableOpacity style={styles.newPostButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.newPostButtonText}>
            New Post <Entypo name="plus" size={16} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <BakeryPost item={item} />}
        keyExtractor={(_, index) => index.toString()}
        style={styles.list}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        hasBackdrop
      >
        <View style={[styles.modalView, { alignItems: "center", gap: 10 }]}>
          <Ionicons name="checkmark-circle" size={40} color={Colors.green} />
          <View style={{ alignItems: "center", gap: 6 }}>
            <Text style={styles.modalTitle}>Post published</Text>
            <Text style={[styles.modalText, { fontWeight: "300" }]}>+20 points</Text>
          </View>
          <ThemedButton
            type="secondary"
            style={{ width: "100%", marginTop: 10 }}
            onPress={() => { }}
          >
            View post
          </ThemedButton>
        </View>
      </Modal >
    </View >
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.primary,
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

  modalBackdrop: {
    backgroundColor: "black",
  },
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 350,
    gap: 18,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
  modalButtonsView: {
    flexDirection: "row",
  },
  modalButtonLeft: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: Colors.grayLight,
    borderWidth: 2,
    borderRightWidth: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  modalButtonRight: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: Colors.grayLight,
    borderWidth: 2,
    borderLeftWidth: 1,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
