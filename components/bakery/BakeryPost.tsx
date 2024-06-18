import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { Post, User } from "@/types";
import { ThemedButton } from "../ThemedButton";
import {
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "@/hooks";
import { useEffect, useState } from "react";

export default function BakeryPost({ post }: { post: Post }) {
  const [user, setUser] = useUser();
  const [hasMunchedBefore, setHasMunchedBefore] = useState(false);
  const db = getFirestore();

  const checkMunch = async () => {
    if (!user) return false;
    const foundPostInMunches = !!user.munchedPostIds.find((e) => e === post.id);
    if (foundPostInMunches) return true;

    const userMunchedPostIdsDocRef = doc(
      db,
      "users",
      user.id,
      "munchedPostIds",
      post.id,
    );
    try {
      const res = await getDoc(userMunchedPostIdsDocRef); // add to collection
      if (res.exists()) {
        setUser({
          ...user,
          munchedPostIds: [...user.munchedPostIds, post.id],
        });
        return true;
      }
      console.log("Checked munch in firestore");
    } catch (err) {
      console.error(
        "Failed trying to find postId in user's munchedPostIds",
        err,
      );
    }
    return false;
  };

  useEffect(() => {
    (async () => {
      setHasMunchedBefore(await checkMunch());
    })();
  }, [user]);

  if (!user) return null;

  const getTimeAgo = (epochTime: string): string => {
    const currentTime = Date.now();
    const elapsed = currentTime - parseInt(epochTime);

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  // designed munch with no undo in mind

  const updateMunch = async () => {
    // +1 to
    //   - post's munches
    //   - poster's totalMunches
    // for user
    //   - update last munch
    //   - add post id to user's munchedPostIds collection to keep track of what's munched before
    const postRef = doc(db, "posts", post.id);
    const posterRef = doc(db, "users", post.uid);
    const userMunchedPostIdsDocRef = doc(
      db,
      "users",
      user.id,
      "munchedPostIds",
      post.id,
    );
    const userRef = doc(db, "users", user.id);
    try {
      await updateDoc(postRef, { munches: increment(1) });
      await updateDoc(posterRef, { totalMunches: increment(1) });

      const lastMunch: User["lastMunch"] = {
        postId: post.id,
        time: new Date().getTime().toString(),
      };
      await setDoc(userRef, { lastMunch });
      await setDoc(userMunchedPostIdsDocRef, {}); // add to collection
      setUser({
        ...user,
        munchedPostIds: [...user.munchedPostIds, post.id],
      }); // update state
      console.log("Munch success");
    } catch (err) {
      console.error("Everything just broke when munch", err);
    }
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.listHeader}>
        <View style={styles.profileAndTimeContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              // todo
            }}
          >
            <View style={styles.listItemProfile}>
              <ThemedText type="small">
                {post.username.slice(0, 2).toUpperCase()}
              </ThemedText>
            </View>
          </TouchableWithoutFeedback>
          <ThemedText type="default" style={styles.timeText}>
            {getTimeAgo(post.createdAt)}
          </ThemedText>
        </View>
        <ThemedButton
          type={hasMunchedBefore ? "secondary" : "primary"}
          style={styles.munchButton}
          disabled={hasMunchedBefore}
          onPress={updateMunch}
        >
          {hasMunchedBefore ? "Maybe icon here? No idea" : "Munch!"}
        </ThemedButton>
      </View>
      {post.image && (
        <Image source={{ uri: `${post.image}` }} style={styles.listItemImage} />
      )}
      <ThemedText type="defaultSemiBold" style={styles.munches}>
        {post.munches} bread lovers have munched this
      </ThemedText>
      <ThemedText type="default">{post.description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
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
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: Colors.grayLight,
    borderWidth: 1,
    backgroundColor: Colors.darkPink,
  },
  listItemImage: {
    width: "100%",
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
  profileAndTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 8,
  },
  munches: {
    color: Colors.gray,
  },
  munchButton: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 15,
  },
});
