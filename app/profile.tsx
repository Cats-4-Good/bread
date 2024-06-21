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
import { useUser } from "@/hooks";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

export default function ProfileScreen() {
  const [user, _] = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMunchesTooltipVisible, setMunchesTooltipVisible] = useState(false);
  const [isFoodSavedTooltipVisible, setFoodSavedTooltipVisible] = useState(false);

  const db = getFirestore();

  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      try {
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
        setPosts(posts);
      } catch (err) {
        console.error("Failed to get posts of user", err);
      }
    })();
  }, [user]);

  return (
    <View style={styles.content}>
      <View
        style={{
          marginTop: Constants.statusBarHeight + 10,
          marginBottom: 20,
        }}
      >
        <ThemedText type="title" style={{ alignSelf: "center" }}>{user.username}</ThemedText>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <ThemedText type="default" style={styles.statLabel}>You munched on</ThemedText>
            <ThemedText type="title" style={styles.statNumber}>{user.userMunches ?? 0}</ThemedText>
            <View style={styles.tooltipView}>
              <ThemedText type="default" style={styles.statLabel}>&nbsp;lobangs</ThemedText>
              <TouchableOpacity onPress={() => setMunchesTooltipVisible(true)}>
                <MaterialIcons name="info-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statBox}>
            <ThemedText type="default" style={styles.statLabel}>Your lobangs saved</ThemedText>
            <ThemedText type="title" style={styles.statNumber}>{user.postsFoodSaved ?? 0}</ThemedText>
            <View style={styles.tooltipView}>
              <ThemedText type="default" style={styles.statLabel}>&nbsp;food items</ThemedText>
              <TouchableOpacity onPress={() => setFoodSavedTooltipVisible(true)}>
                <MaterialIcons name="info-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <BakeryPost post={item} showBakeryName isProfileView />}
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
          <ThemedText type="default" style={styles.modalText}>are the number of "I'm buying this!" indications.</ThemedText>
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
          <ThemedText style={styles.modalTitle}>Food items saved</ThemedText>
          <ThemedText type="default" style={styles.modalText}>estimates the total food waste your lobangs have helped save.</ThemedText>
          <ThemedText type="default" style={styles.modalText}>Your lobangs have spurred {user.postsFoodSaved} clearance purchases preventing food waste!</ThemedText>
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
    marginTop: 10,
    marginHorizontal: 20,
    gap: 10,
  },
  statBox: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
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
  tooltipView: {
    flexDirection: "row",
    gap: 3,
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
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 340,
    gap: 10,
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
