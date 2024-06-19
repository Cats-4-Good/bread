import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { Bakery, GoogleListing } from "@/types";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

interface Props {
  bakeries: Bakery[];
}

export default function MapNearbyNewPostButton({ bakeries }: Props) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleSelectListing = (listing: GoogleListing) => {
    setModalOpen(false);
    router.push({
      pathname: `/${listing.name}/new`,
      params: { ...listing },
    });
  };

  return (
    <>
      <ThemedButton type="round" style={styles.addPostButton} onPress={() => setModalOpen(true)}>
        <Entypo name="plus" size={20} color="white" />
      </ThemedButton>

      <Modal isVisible={modalOpen} onBackdropPress={() => setModalOpen(false)} hasBackdrop>
        <View style={styles.modalView}>
          <ThemedText type="title">Select your current location to share a lobang!</ThemedText>
          <FlatList
            data={bakeries}
            keyExtractor={(item) => item.listing.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectListing(item.listing)}>
                <View style={styles.listItem}>
                  <ThemedText type="defaultSemiBold">{item.listing.name}</ThemedText>
                  <ThemedText type="default">{item.listing.vicinity}</ThemedText>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addPostButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.secondary,
  },
  modalView: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
});
