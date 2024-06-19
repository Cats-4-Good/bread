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
import { useEffect, useState } from "react";
import { ThemedText, ThemedButton } from "@/components";
import BakeryPost from "@/components/bakery/BakeryPost";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/hooks";

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const [currentUser, _setCurrentUser] = useUser();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const db = getFirestore();

  const logoutHandler = () => {
    console.log("Logging out...");
    // TODO: redirect to login screen
  };

  const getBakeryPostsByUser = async (userId: string): Promise<Post[]> => {
    try {
      const posts: Post[] = [];
      const q = query(
        collection(db, "posts"),
        where("uid", "==", userId),
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
        const userId = (params.userId as string) || currentUser?.id;
        if (!userId) {
          return;
        }
        setUser({ id: userId, username: currentUser?.username ?? "User's Name" }); // Fetch the username based on userId if needed
        const posts = await getBakeryPostsByUser(userId);
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [params.userId, currentUser]);

  return (
    <View style={styles.content}>
      {user && (
        <View style={{ alignItems: "center", marginVertical: 40 }}>
          <ThemedText type="title">{user.username}</ThemedText>
          <ThemedButton
            type="primary"
            onPress={logoutHandler}
            style={{ marginTop: 10, width: 150 }}
          >
            Logout
          </ThemedButton>
        </View>
      )}

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
  list: {
    width: "auto",
  },
  noPostFoundText: {
    textAlign: "center",
    marginTop: 40,
  },
});
