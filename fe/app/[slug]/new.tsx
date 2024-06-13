import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ThemedButton } from "@/components/ThemedButton";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';

const discountTypes = [
  {
    label: "Penis",
    value: "penis",
    pricePlaceholder: "Something",
  },
  {
    label: "Penis1",
    value: "penis1",
    pricePlaceholder: "Something1",
  },
];

export default function NewPost() {
  const { choice } = useLocalSearchParams<{ slug: string; choice?: string }>();
  const [individualSelected, setIndividualSelected] = useState(
    choice === "false" ? false : choice === "true" ? true : null,
  );
  const [image, setImage] = useState<string>();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState();
  const [price, setPrice] = useState("");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (individualSelected === null) return null;
  return (
    <View style={styles.container}>
      <View style={styles.modalButtonsView}>
        <TouchableOpacity
          style={[
            styles.modalButtonLeft,
            individualSelected === false && {
              backgroundColor: Colors.accent,
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


      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.postView}>
            <TouchableOpacity onPress={pickImage}>
              <View style={[styles.inputView, { paddingVertical: 0, paddingHorizontal: 0 }]}>
                {image
                  ? <Image source={{ uri: image }} style={styles.image} />
                  : (
                    <View style={styles.uploadImageView}>
                      <Ionicons name="cloud-upload" size={60} color="gray" />
                      <Text style={{ fontSize: 16, color: Colors.gray }}>Upload photo</Text>
                    </View>
                  )
                }
              </View>
            </TouchableOpacity>
            {individualSelected &&
              <TextInput
                editable
                maxLength={50}
                onChangeText={text => setItemName(text)}
                value={itemName}
                placeholder="Item name"
                placeholderTextColor={Colors.gray}
                style={[styles.inputView, { height: 50 }]}
              />}
            <TextInput
              editable
              multiline // this is still buggy need to restrict number of lines or do some parsing but don't want to waste time on this
              textAlignVertical="top"
              maxLength={100}
              onChangeText={text => setDescription(text)}
              value={description}
              placeholder="Description"
              placeholderTextColor={Colors.gray}
              style={[styles.inputView, { height: 150 }]}
            />
            <Picker
              selectedValue={discountType}
              onValueChange={(itemValue, _itemIndex) => {
                setDiscountType(itemValue);
                setPrice("");
              }}
              style={styles.inputView}
            >
              {discountTypes.map((e, i) => <Picker.Item {...e} key={i} />)}
            </Picker>
            <TextInput
              editable={!!discountType}
              maxLength={50}
              onChangeText={text => setPrice(text)}
              value={price}
              placeholder={
                discountType
                  ? discountTypes.find(e => e.value === discountType)?.pricePlaceholder
                  : "Select discount type"
              }
              placeholderTextColor={Colors.gray}
              style={styles.inputView}
            />
            <ThemedButton
              type="primary"
              style={{ alignSelf: 'center' }}
              onPress={() => { }}
            >
              Create post
            </ThemedButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 30,
    gap: 20,
  },

  modalButtonsView: {
    flexDirection: "row",
    marginHorizontal: 30,
  },
  modalButtonLeft: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: Colors.accent,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  modalButtonRight: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: Colors.accent,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.accent,
  },

  safeAreaView: {
    flex: 1,
  },
  postView: {
    gap: 20,
    marginBottom: 20
  },
  uploadImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  inputView: {
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
    overflow: 'hidden', // for image,
    fontSize: 16,
  }
});
