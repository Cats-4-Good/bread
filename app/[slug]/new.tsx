import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ThemedButton } from "@/components";
import { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { Post } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/hooks";

export default function NewPost() {
  const params = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState<string | null>(null);
  const camera = useRef<CameraView | null>(null);
  const [user, _setUser] = useUser();
  const storage = getStorage();
  const db = getFirestore();

  const takePicture = async () => {
    const picture = await camera.current?.takePictureAsync();
    if (!picture?.uri) return;
    setUri(picture.uri);
  };

  const createPost = async () => {
    let image = null;
    if (uri) {
      const blob = (await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      })) as any;

      const id = uuid.v4().toString();
      const storageRef = ref(storage, id);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      image = await getDownloadURL(storageRef);
    }

    if (!user) return console.log("wtf");
    const data: Omit<Post, "id"> = {
      uid: user.id,
      username: user.username,
      bakeryId: params.place_id as string,
      createdAt: new Date().getTime().toString(),
      isLive: true,
      image,
      description,
      views: 0,
      munches: 0,
      foodSaved: 0,
    };

    const docRef = await addDoc(collection(db, "posts"), data);
    console.log("Document written with ID: ", docRef.id);
  };

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <ThemedButton onPress={requestPermission}>
          Grant Permission
        </ThemedButton>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={(ref) => (camera.current = ref)}
        mode="picture"
        facing="back"
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <TextInput
        editable
        multiline // this is still buggy need to restrict number of lines or do some parsing but don't want to waste time on this
        textAlignVertical="top"
        maxLength={100}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder="Description"
        placeholderTextColor={Colors.gray}
        style={styles.description}
      />
      <ThemedButton type="primary" onPress={createPost}>
        Submit
      </ThemedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    borderRadius: 10,
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
