import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "@/constants/Colors";
import { Post } from "@/types";
import {
  getDocs,
  getFirestore,
  collection,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useUser } from "@/hooks";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components";
import { ThemedButton } from "@/components";
import BakeryPost from "@/components/bakery/BakeryPost";

export default function ProfileScreen() {
  const [user, setUser] = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  const db = getFirestore();

  console.log(user);

  const logoutHandler = () => {
    console.log("Logging out...");
    // TODO
    // redirect to login screen
  };

  const getBakeryPostsByUser = async (): Promise<Post[]> => {
    try {
      if (!user) {
        return [];
      }

      const posts: Post[] = [];
      const q = query(
        collection(db, "posts"),
        where("uid", "==", user.id),
        orderBy("createdAt", "desc"),
        limit(10)
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
      console.error("Failed to get posts of user", err);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setPosts([]);
        const posts = await getBakeryPostsByUser();
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [user?.id]);

  return (
    <View style={styles.content}>
      <View style={{ alignItems: "center", marginVertical: 40 }}>
        <ThemedText type="title">{user?.username}</ThemedText>
        <ThemedButton type="primary" onPress={logoutHandler} style={{ marginTop: 10, width: 150 }}>
          Logout
        </ThemedButton>
      </View>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <BakeryPost post={item} showBakeryName={true} />}
          keyExtractor={(_, index) => index.toString()}
          style={styles.list}
        />
      ) : (
        <ThemedText style={styles.noPostFoundText}>
          No posts found... Start your first post to make a difference now!
        </ThemedText>
      )}
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
  noPostFoundText: {
    textAlign: "center",
    marginTop: 40,
  },
});
