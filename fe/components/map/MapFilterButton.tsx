import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationObjectCoords } from "expo-location";

import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";

interface Props {
  markers: LocationObjectCoords[];
  setMarkers: (markers: LocationObjectCoords[]) => void;
}

export default function MapFilterButton({ markers, setMarkers }: Props) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleFilter = (filterType: string) => {
    console.log(`Filtering: ${filterType}`);
    setModalVisible(false);
  };

  return (
    <View style={styles.content}>
      <ThemedButton type="round" style={styles.centerButton} onPress={toggleModal}>
        <FontAwesome5 name="filter" size={20} color="white" />
      </ThemedButton>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.3}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleFilter("All bakeries")}
          >
            <ThemedText type="default">All bakeries</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleFilter("Bakeries with listings")}
          >
            <ThemedText type="default">Bakeries with listings</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  centerButton: {
    position: "absolute",
    bottom: 80,
    right: 14,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
});
