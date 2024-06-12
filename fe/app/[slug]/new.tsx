import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";

export default function NewPost() {
  const { choice } = useLocalSearchParams<{ slug: string; choice?: string }>();
  const [individualSelected, setIndividualSelected] = useState(
    choice === "false" ? false : choice === "true" ? true : null,
  );
  if (individualSelected === null) return null;

  return (
    <View style={styles.container}>
      <View style={styles.modalButtonsView}>
        <TouchableOpacity
          style={[
            styles.modalButtonLeft,
            individualSelected === false && {
              backgroundColor: Colors.accent,
              borderColor: Colors.accent,
            },
          ]}
          onPress={() => setIndividualSelected(false)}
        >
          <Text
            style={[
              styles.modalButtonText,
              individualSelected === false && { color: Colors.white },
            ]}
          >
            Bakery-wide
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalButtonRight,
            individualSelected === true && {
              backgroundColor: Colors.accent,
              borderColor: Colors.accent,
            },
          ]}
          onPress={() => setIndividualSelected(true)}
        >
          <Text
            style={[
              styles.modalButtonText,
              individualSelected === true && { color: Colors.white },
            ]}
          >
            Individual
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  modalBackdrop: {
    backgroundColor: "black",
  },
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 320,
    gap: 18,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
  modalButtonsView: {
    flexDirection: "row",
  },
  modalButtonLeft: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: Colors.grayLight,
    borderWidth: 2,
    borderRightWidth: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  modalButtonRight: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: Colors.grayLight,
    borderWidth: 2,
    borderLeftWidth: 1,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
