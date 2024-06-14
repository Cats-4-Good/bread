import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import BakeryPost from "@/components/bakery/BakeryPost";
import { listings } from "@/components/bakery/temp-data";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import Modal from "react-native-modal";
import { router, useLocalSearchParams } from "expo-router";

export default function BakeryList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [individualSelected, setIndividualSelected] = useState<boolean | null>(null);
  const { slug } = useLocalSearchParams();

  const handlePress = (choice: boolean) => {
    if (individualSelected !== null) return;
    setIndividualSelected(choice);
    setTimeout(() => {
      setModalVisible(false);
      setIndividualSelected(null);
      router.push(`/${slug}/new?choice=${choice}`);
    }, 500);
  };

  return (
    <View style={styles.content}>
      <Image
        source={{
          uri: "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg",
        }}
        style={styles.bakeryImage}
      />
      <View>
        <TouchableOpacity style={styles.newPostButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.newPostButtonText}>
            New Post <Entypo name="plus" size={16} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={listings}
        renderItem={({ item }) => <BakeryPost item={item} />}
        keyExtractor={(_, index) => index.toString()}
        style={styles.list}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          setIndividualSelected(null);
        }}
        hasBackdrop
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Type of post</Text>
          <Text style={styles.modalText}>
            If you are posting discounts w/ multiple items, please select “Bakery-wide”
          </Text>
          <View style={styles.modalButtonsView}>
            <TouchableOpacity
              style={[
                styles.modalButtonLeft,
                individualSelected === false && {
                  backgroundColor: Colors.accent,
                  borderColor: Colors.accent,
                },
              ]}
              onPress={() => handlePress(false)}
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
              onPress={() => handlePress(true)}
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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  bakeryImage: {
    width: "100%",
    aspectRatio: 2,
    maxHeight: 200,
  },
  newPostButton: {
    backgroundColor: "#CF9C61",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  newPostButtonText: {
    color: "white",
    fontSize: 16,
  },
  list: {
    width: "auto",
    marginHorizontal: 20,
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
