import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import BakeryPost from "@/components/bakery/BakeryPost";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Modal from "react-native-modal";
import { router, useLocalSearchParams } from "expo-router";
import {
  query,
  where,
  getDocs,
  getFirestore,
  collection,
  orderBy,
} from "firebase/firestore";
import { ThemedButton, ThemedText } from "@/components";
import { Post } from "@/types";

export default function BakeryPosts() {
  const [modalVisible, setModalVisible] = useState(false);
  const params = useLocalSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);

  const db = getFirestore();

  const getBakeryPosts = async (bakeryId: string): Promise<Post[]> => {
    try {
      const posts: Post[] = [];
      const q = query(
        // in future use collection of post ids in each bakery, then fetch posts that way for scalability
        collection(db, "posts"),
        where("bakeryId", "==", bakeryId),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        } as Post);
      });
      return posts;
    } catch (err) {
      console.error("Failed to get posts of bakery", err);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setPosts([]); // for when change posts
        const posts = await getBakeryPosts(params.place_id as string);
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [params.place_id]);

  return (
    <View style={styles.content}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <BakeryPost post={item} />}
          keyExtractor={(_, index) => index.toString()}
          style={styles.list}
          ListHeaderComponent={
            <View>
              <Image
                source={{
                  uri: `${params.image ?? "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg"}`,
                }}
                style={styles.bakeryImage}
              />
              <View style={{ paddingRight: 18, paddingVertical: 5 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{ textAlign: "right" }}
                >
                  {params.vicinity}
                </ThemedText>
                <ThemedText type="default" style={{ textAlign: "right" }}>
                  {params.status}
                </ThemedText>
              </View>
            </View>
          }
        />
      ) : (
        <ThemedText style={styles.noPostFoundText}>
          No posts found... Be the first to make a difference!
        </ThemedText>
      )}

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
            <Text style={[styles.modalText, { fontWeight: "300" }]}>
              +20 points
            </Text>
          </View>
          <ThemedButton
            type="secondary"
            style={{ width: "100%", marginTop: 10 }}
            onPress={() => { }}
          >
            View post
          </ThemedButton>
        </View>
      </Modal>

      <ThemedButton
        type="round"
        style={styles.addPostButton}
        onPress={() => {
          router.push({
            pathname: `/${params.name}/new`,
            params: { place_id: params.place_id },
          });
        }}
      >
        <Entypo name="plus" size={20} color="white" />
      </ThemedButton>
    </View>
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
    alignSelf: "flex-start",
  },
  newPostButtonText: {
    color: "white",
    fontSize: 16,
  },
  list: {
    width: "auto",
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
  addPostButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  noPostFoundText: {
    textAlign: "center",
    marginTop: 40,
  },
});