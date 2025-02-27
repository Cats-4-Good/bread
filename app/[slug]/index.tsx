import { View, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { Entypo } from "@expo/vector-icons";
import BakeryPost from "@/components/bakery/BakeryPost";
import { useCallback, useState } from "react";
import { Colors } from "@/constants/Colors";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { query, where, getDocs, getFirestore, collection, orderBy } from "firebase/firestore";
import { ThemedButton, ThemedText } from "@/components";
import { GoogleListing, Post } from "@/types";
import { useGooglePicture } from "@/hooks";

export default function BakeryPosts() {
  const { slug, ...params } = useLocalSearchParams();
  const image = useGooglePicture(params.place_id as string, params.photoReference as string | undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const db = getFirestore();

  const getBakeryPosts = async (bakeryId: string): Promise<Post[]> => {
    try {
      const posts: Post[] = [];
      const q = query(
        // in future use collection of post ids in each bakery, then fetch posts that way for scalability
        collection(db, "posts"),
        where("bakeryId", "==", bakeryId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        } as Post);
      });
      return posts;
    } catch (err) {
      console.error("Failed to get posts of bakery", err);
      return [];
    }
  };

  // use focus so that when route back from new post to the same slug it rerenders tho this is not optimized
  // i don't know how to fix the flashing
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setIsLoading(true);
      getBakeryPosts(params.place_id as string)
        .then(posts => {
          if (isActive) {
            setPosts(posts);
            setIsLoading(false);
          }
        })
        .catch(error => console.error("Error fetching data:", error));
      return () => {
        isActive = false;
        setIsLoading(true); // this is very weird but need to set state here, possibly might break
      };
    }, [params.place_id])
  );

  return (
    <View style={styles.content}>
      {isLoading
        ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
        : <FlatList
          data={posts}
          renderItem={({ item }) => <BakeryPost post={item} />}
          keyExtractor={(_, index) => index.toString()}
          style={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.imageView}>
                <Image
                  source={{ uri: image }}
                  style={styles.bakeryImage}
                />
              </View>
              <View style={{ paddingRight: 18, paddingVertical: 5 }}>
                <ThemedText type="defaultSemiBold" style={{ textAlign: "right" }}>
                  {params.vicinity}
                </ThemedText>
                <ThemedText type="default" style={{ textAlign: "right" }}>{params.status === "CLOSED_TEMPORARILY" ? "CLOSED" : (params.status === "OPERATIONAL" ? "OPEN" : params.status)}</ThemedText>
              </View>
            </View>
          }
          ListEmptyComponent={<ThemedText style={styles.noPostFoundText}>
            No lobangs found... Be the first to make a difference!
          </ThemedText>}
        />
      }

      <ThemedButton
        type="round"
        style={styles.addPostButton}
        onPress={() => {
          router.push({
            pathname: `/${params.name}/new`,
            params,
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
  header: {
    gap: 8,
    marginBottom: 10,
  },
  imageView: {
    width: '100%',
    maxHeight: 300,
    overflow: 'hidden',
  },
  bakeryImage: {
    width: '100%',
    aspectRatio: 1,
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
