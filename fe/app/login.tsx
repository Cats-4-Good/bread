import { useState } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";

import storage from "@/components/storage/Storage";
import { Colors } from "@/constants/Colors";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components";

export default function LoginScreen() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const loginHandler = async () => {
    // i did not do any advanced validation here. maybe will do next time
    if (username.replaceAll(" ", "") === "" || email.replaceAll(" ", "") === "") {
      Alert.alert("Whoops!", "Please fill in both fields");
      return;
    }

    // TODO
    // request to get token from server

    try {
      const response = await fetch("https://4b08-116-15-47-239.ngrok-free.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      // const { token } = data;

      // // Save user data to storage
      // storage.save({
      //   key: "user",
      //   data: {
      //     username,
      //     email,
      //     token,
      //   },
      // });

      // // Load user data from storage
      // const userData = await storage.load({
      //   key: "user",
      //   autoSync: true,
      //   syncInBackground: true,
      // });

      // console.log(userData.username);

      // Alert.alert("Success", `Logged in as ${username}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to log in. Please check your username and email.");
    }

    // save user data to storage
    // storage.save({
    //   key: "user",
    //   data: {
    //     username,
    //     email,
    //     token: "1234567890",
    //   },
    // });

    // // load user data from storage
    // storage.load({
    //   key: "user",
    //   autoSync: true,
    //   syncInBackground: true,
    // })
    //   .then((ret) => {
    //     // if found, return user data
    //     // TODO
    //     console.log(ret.username);
    //   })
    //   .catch((err) => {
    //     console.warn(err.message);
    //   });

    // // TODO
    // Alert.alert("Success", `Logged in as ${username}`);
  };

  return (
    <View style={styles.content}>
      <ThemedText type="title">Login to Crumbs!</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={"black"}
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholderTextColor={"black"}
        autoCorrect={false}
      />
      <ThemedButton type="primary" onPress={loginHandler} style={styles.loginButton}>
        Login
      </ThemedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.primary,
  },
  input: {
    width: "100%",
    padding: 9,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  loginButton: {
    width: "100%",
    marginTop: 10,
  },
});
