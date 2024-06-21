import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ThemedButton } from "@/components";
import { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import uuid from "react-native-uuid";
import { collection, addDoc, getFirestore, updateDoc, doc, increment } from "firebase/firestore";
import { Post } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/hooks";
import { router } from "expo-router";

export default function NewPost() {
  const { slug, ...params } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const camera = useRef<CameraView | null>(null);
  const [user, _] = useUser();
  const storage = getStorage();
  const db = getFirestore();

  const takePicture = async () => {
    const picture = await camera.current?.takePictureAsync({ quality: 0 });
    if (!picture?.uri) return;
    setUri(picture.uri);
  };
  //  Load blob (promise)

  const createPost = async () => {
    if (!user || !uri) return console.log("No user / uri");

    const id = uuid.v4().toString();
    const storageRef = ref(storage, id);
    const img = await fetch(uri);
    const blob = await img.blob();

    console.log("uploading image");
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed', (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      setIsLoading(true);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
      (error) => {
        setIsLoading(false);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            console.log("User doesn't have permission to access the object");
            break;
          case 'storage/canceled':
            console.log("User canceled the upload");
            break;
          case 'storage/unknown':
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('File available at', downloadURL);
          const data: Omit<Post, "id"> = {
            uid: user.id,
            username: user.username,
            bakeryId: params.place_id as string,
            bakeryName: params.name as string,
            createdAt: Date.now(),
            isLive: true,
            image: downloadURL,
            description,
            views: 0,
            munches: 0,
            foodSaved: 0,
          };

          try {
            const docRef = await addDoc(collection(db, "posts"), data);
            console.log("Document written with ID: ", docRef.id);

            const bakeryRef = doc(db, "bakeries", data.bakeryId);
            await updateDoc(bakeryRef, {
              livePostsCount: increment(1),
              totalPosts: increment(1),
            });
            setDescription("");

            // redirect to bakery posts
            router.dismissAll();
            router.replace({
              pathname: `/${params.name}`,
              params,
            });
          } catch (e) {
            console.error("Failed to make post", e);
          }
        });
      }
    );
  };

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.permissionView}>
        <ThemedButton type="primary" style={styles.permissionButton} onPress={requestPermission}>Allow Camera Permission</ThemedButton>
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} keyboardVerticalOffset={100} style={styles.container}>
        {uri ? (
          <Image source={{ uri }} style={styles.camera} />
        ) : (
          <CameraView
            style={styles.camera}
            ref={(ref) => (camera.current = ref)}
            mode="picture"
            facing="back"
          >
            <TouchableOpacity style={styles.button} onPress={takePicture} />
          </CameraView>
        )}
        <TextInput
          editable
          textAlignVertical="top"
          maxLength={100}
          onChangeText={(text) => setDescription(text)}
          value={description}
          placeholder="Description"
          placeholderTextColor={Colors.gray}
          style={styles.description}
        />
        <ThemedButton type="primary" style={isLoading && { backgroundColor: Colors.accentLight }} disabled={isLoading} onPress={createPost}>
          {isLoading ? "Submitting..." : "Submit"}
        </ThemedButton>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  permissionView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  permissionButton: {
    width: 300,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    marginHorizontal: "auto",
    marginBottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    borderWidth: 5,
    borderColor: Colors.grayLight,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});
