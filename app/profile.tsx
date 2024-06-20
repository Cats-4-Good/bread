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
import { useUser, useUserStorage } from "@/hooks";
import { router } from "expo-router";

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const [_, { remove }] = useUserStorage();
  const [currentUser, _setCurrentUser] = useUser();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const db = getFirestore();

  const logoutHandler = async () => {
    console.log("Logging out...");
    // TODO: redirect to login screen
    await remove();
    router.replace("/");
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
        // const userId = (params.userId as string) || currentUser?.id;
        const userId = currentUser?.id;
        if (!userId) {
          return;
        }
        console.log(currentUser);
        setUser({ id: userId, username: currentUser?.username ?? "user" });
        const posts = await getBakeryPostsByUser(userId);
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [params.userId, currentUser]);

  return (
    <View style={styles.content}>
      {user && currentUser && (
        <View style={{ alignItems: "center", marginVertical: 40 }}>
          <ThemedText type="title">{user.username}</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <ThemedText type="title" style={styles.statNumber}>
                {currentUser.totalMunches ? currentUser.totalMunches : 0}
              </ThemedText>
              <ThemedText type="default" style={styles.statLabel}>
                Munches
              </ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText type="title" style={styles.statNumber}>
                {currentUser.totalFoodSaved ? currentUser.totalFoodSaved : 0}
              </ThemedText>
              <ThemedText type="default" style={styles.statLabel}>
                Food Saved
              </ThemedText>
            </View>
          </View>
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
          No lobangs found... Be the first to make a difference!
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  statBox: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.white,
  },
  list: {
    width: "auto",
  },
  noPostFoundText: {
    textAlign: "center",
    marginTop: 40,
  },
});
