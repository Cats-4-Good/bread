import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
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
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const [_, { remove }] = useUserStorage();
  const [currentUser, _setCurrentUser] = useUser();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMunchesTooltipVisible, setMunchesTooltipVisible] = useState(false);
  const [isFoodSavedTooltipVisible, setFoodSavedTooltipVisible] = useState(false);

  const db = getFirestore();

  const logoutHandler = async () => {
    console.log("Logging out...");
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
        const paramId = params.userId as string;
        const ownId = currentUser?.id;
        let posts;

        if (paramId && paramId !== ownId) {
          setUser({ id: paramId, username: params.username as string });
          posts = await getBakeryPostsByUser(paramId);
        } else {
          const userId = currentUser?.id;
          if (!userId) {
            return;
          }
          setUser({ id: userId, username: currentUser.username });
          posts = await getBakeryPostsByUser(userId);
        }
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [params.userId, currentUser]);

  return (
    <View style={styles.content}>
      {user && currentUser && (
        <View
          style={{
            alignItems: "center",
            marginTop: Constants.statusBarHeight + 10,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              position: "relative",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText type="title">{user.username}</ThemedText>
            <TouchableOpacity style={{ position: "absolute", right: 20 }} onPress={logoutHandler}>
              <MaterialIcons name="logout" size={35} />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <ThemedText type="title" style={styles.statNumber}>
                {currentUser.totalMunches ? currentUser.totalMunches : 0}
              </ThemedText>
              <View style={styles.labelContainer}>
                <ThemedText type="default" style={styles.statLabel}>
                  Munches
                </ThemedText>
                <TouchableOpacity onPress={() => setMunchesTooltipVisible(true)}>
                  <MaterialIcons name="info-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.statBox}>
              <ThemedText type="title" style={styles.statNumber}>
                {currentUser.totalFoodSaved ? currentUser.totalFoodSaved : 0}
              </ThemedText>
              <View style={styles.labelContainer}>
                <ThemedText type="default" style={styles.statLabel}>
                  Food Saved
                </ThemedText>
                <TouchableOpacity onPress={() => setFoodSavedTooltipVisible(true)}>
                  <MaterialIcons name="info-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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

      <Modal
        isVisible={isMunchesTooltipVisible}
        onBackdropPress={() => setMunchesTooltipVisible(false)}
        hasBackdrop
      >
        <View style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>Munches</ThemedText>
          <ThemedText type="default" style={styles.modalText}>
            Munches are the number of "I'm buying this!" indications. Treat it as a like or upvote
            on your favourite social media platform!
          </ThemedText>
          <ThemedButton
            type="primary"
            style={{ paddingVertical: 16 }}
            onPress={() => {
              setMunchesTooltipVisible(false);
            }}
          >
            Close
          </ThemedButton>
        </View>
      </Modal>

      <Modal
        isVisible={isFoodSavedTooltipVisible}
        onBackdropPress={() => setFoodSavedTooltipVisible(false)}
        hasBackdrop
      >
        <View style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>Food Saved</ThemedText>
          <ThemedText type="default" style={styles.modalText}>
            Food items saved estimates the amount of waste you've helped to prevent using your munch
            count. Thank you for doing your part to fight food waste!
          </ThemedText>
          <ThemedButton
            type="primary"
            style={{ paddingVertical: 16 }}
            onPress={() => {
              setFoodSavedTooltipVisible(false);
            }}
          >
            Close
          </ThemedButton>
        </View>
      </Modal>
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
    marginTop: 10,
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
    paddingRight: 3,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  list: {
    width: "auto",
  },
  noPostFoundText: {
    textAlign: "center",
    marginTop: 40,
  },
  tooltip: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 340,
    gap: 14,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
});
