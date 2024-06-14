import { useState } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";

// import { API_URL } from "@env";
const API_URL = "";
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

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const { userId } = data;

      // Save user data to storage
      storage.save({
        key: "user",
        data: {
          username,
          email,
          userId,
        },
      });

      Alert.alert("Success", `Logged in as ${username}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to log in. Please check your username and email.");
    }
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
    borderColor: Colors.grayLight,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  loginButton: {
    width: "100%",
    marginTop: 10,
  },
});
