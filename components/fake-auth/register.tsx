// RegisterScreen.tsx
import { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components";
import uuid from "react-native-uuid";
import { useUserStorage } from "@/hooks";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [userStorage, { save }] = useUserStorage();
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const register = async () => {
    if (!username.replaceAll(" ", "")) return Alert.alert("Error", "Invalid username");
    const id = uuid.v4().toString();
    await save({ id, username });
  };

  return (
    <View style={styles.content}>
      <ThemedText type="title">Crumbs</ThemedText>
      <ThemedText type="defaultSemiBold">Share deals, slash waste</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={"black"}
        autoCorrect={false}
      />
      <ThemedButton type="primary" onPress={register} style={styles.registerButton}>
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
