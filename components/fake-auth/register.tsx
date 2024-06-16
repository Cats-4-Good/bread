import { useState } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components";
import uuid from 'react-native-uuid';
import storage from "@/components/storage/Storage";

export default function RegisterScreen({ refresh }: { refresh: () => void }) {
  const [username, setUsername] = useState<string>("");

  const register = async () => {
    if (!username.replaceAll(" ", "")) return Alert.alert("Error", "Invalid username");
    const id = uuid.v4();
    await storage.save({
      key: "user",
      data: {
        username,
        id,
      },
    });
    console.log("Registered");
    refresh();
  };

  return (
    <View style={styles.content}>
      <ThemedText type="title">Register</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={"black"}
        autoCorrect={false}
      />
      <ThemedButton
        type="primary"
        onPress={register}
        style={styles.registerButton}
      >
        Register
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
  registerButton: {
    width: "100%",
    marginTop: 10,
  },
});
