import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ThemedButton } from "@/components/ThemedButton";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// going to keep all types here string because hard to work with number behaviour,
// will add some regex checking to make sure its comprehensible
type DiscountTypes =
  | ((
      | { percentDiscount: string } // E.g. 50% off
      | { priceOff: string } // E.g. $2 off all items
      | { numberOfItems: string } // E.g. 3 for $1
    ) & { price: string }) // Every item shld have final price
  | { price: string }; // Others

const priceRegex = /\$?\d+(?:\.\d{1,2})?/g;

const discountTypes = [
  {
    label: "Type of discount",
    value: "",
    placeholders: ["Select discount type first"],
  },
  {
    label: "Discount % off",
    value: "0",
    placeholders: ["Discount % off (e.g. 20% off)", "Final price (e.g. $3.90)"],
    regex: /\d+(?:\.\d+)?%?/g,
  },
  {
    label: "Price off (e.g. all items $5 off)",
    value: "1",
    placeholders: ["Price off (e.g. $2 off)", "Final price (e.g. $3.90)"],
    regex: priceRegex,
  },
  {
    label: "Fixed price (e.g. 3 for $1)",
    value: "2",
    placeholders: ["Number of items (e.g. 3)", "Final price (e.g. $3.90)"],
    regex: /\d+/g,
  },
  {
    label: "Others",
    value: "3",
    placeholders: ["Clearance offer"],
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
  const [stockLeft, setStockleft] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [discountType, setDiscountType] = useState("");
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [error, setError] = useState(false);

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

  const handleError = () => {
    setError(true);
    setTimeout(() => setError(false), 800);
  };

  const handleSubmit = () => {
    // check required fields for individual
    if (individualSelected && (!image || !itemName)) return handleError();
    // check stockLeft is valid
    if (
      stockLeft &&
      stockLeft.min !== null &&
      stockLeft.max !== null &&
      stockLeft.max < stockLeft.min
    )
      return handleError();

    // check discount type fields
    const field1Regex = discountTypes.find(
      (e) => e.value === discountType,
    )?.regex;
    const field = field1Regex ? field1.match(field1Regex) : "";
    if (field1Regex && !field) return false;
    const price = field2.match(priceRegex);
    if (!price) return false;

    // post
    const data = {
      image,
      itemName,
      description,
      stockLeft,
      discountType,
      price,
      field,
    };
    return true;
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
              <View
                style={[
                  styles.inputView,
                  { paddingVertical: 0, paddingHorizontal: 0 },
                ]}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.uploadImageView}>
                    <Ionicons name="cloud-upload" size={60} color="gray" />
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {individualSelected && (
                        <Text style={{ color: Colors.red }}>*</Text>
                      )}
                      <Text style={{ fontSize: 16, color: Colors.gray }}>
                        Upload photo
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            {individualSelected && (
              <RequiredWrapper empty={!itemName}>
                <TextInput
                  editable
                  maxLength={50}
                  onChangeText={(text) => setItemName(text)}
                  value={itemName}
                  placeholder="Item name"
                  placeholderTextColor={Colors.gray}
                  style={[styles.inputView]}
                />
              </RequiredWrapper>
            )}
            <View
              style={[
                styles.inputView,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 8,
                },
              ]}
            >
              <Text>Estimated</Text>
              <TextInput
                editable
                keyboardType="number-pad"
                maxLength={4}
                onChangeText={(text) =>
                  setStockleft({
                    ...stockLeft,
                    min: !text ? null : Number(text),
                  })
                }
                value={stockLeft.min?.toString()}
                placeholder="Min"
                placeholderTextColor={Colors.gray}
                style={[
                  styles.inputView,
                  { paddingVertical: 10, paddingHorizontal: 10 },
                ]}
              />
              <Text>to</Text>
              <TextInput
                editable
                keyboardType="number-pad"
                maxLength={4}
                onChangeText={(text) =>
                  setStockleft({
                    ...stockLeft,
                    max: !text ? null : Number(text),
                  })
                }
                value={stockLeft.max?.toString()}
                placeholder="Max"
                placeholderTextColor={Colors.gray}
                style={[
                  styles.inputView,
                  { paddingVertical: 10, paddingHorizontal: 10 },
                ]}
              />
              <Text>stock left</Text>
            </View>
            <TextInput
              editable
              multiline // this is still buggy need to restrict number of lines or do some parsing but don't want to waste time on this
              textAlignVertical="top"
              maxLength={100}
              onChangeText={(text) => setDescription(text)}
              value={description}
              placeholder="Description"
              placeholderTextColor={Colors.gray}
              style={[styles.inputView, { height: 150 }]}
            />
            <Picker
              selectedValue={discountType}
              placeholder="Discount type"
              onValueChange={(itemValue, _itemIndex) =>
                setDiscountType(itemValue)
              }
              style={styles.inputView}
            >
              {discountTypes.map((e, i) => (
                <Picker.Item {...e} key={i} />
              ))}
            </Picker>
            {!!discountType && discountType !== "3" && (
              <TextInput
                editable
                maxLength={10}
                onChangeText={(text) => setField1(text)}
                value={field1}
                placeholder={
                  discountTypes.find((e) => e.value === discountType)
                    ?.placeholders[0]
                }
                placeholderTextColor={Colors.gray}
                style={[styles.inputView, !discountType && { opacity: 0.5 }]}
              />
            )}
            <TextInput
              editable={!!discountType}
              maxLength={10}
              onChangeText={(text) => setField2(text)}
              value={field2}
              placeholder={discountTypes
                .find((e) => e.value === discountType)
                ?.placeholders.at(-1)}
              placeholderTextColor={Colors.gray}
              style={[styles.inputView, !discountType && { opacity: 0.5 }]}
            />
            <ThemedButton
              type={error ? "error" : "primary"}
              style={{ alignSelf: "center", width: 200 }}
              onPress={handleSubmit}
              disabled={error}
            >
              {error ? "Failed" : "Create post"}
            </ThemedButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const RequiredWrapper = ({
  children,
  empty,
}: {
  children: React.ReactNode;
  empty: boolean;
}) => {
  return (
    <View style={{ position: "relative" }}>
      {children}
      {empty && (
        <Text
          style={{ color: Colors.red, position: "absolute", left: 10, top: 20 }}
        >
          *
        </Text>
      )}
    </View>
  );
};

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
    marginBottom: 20,
  },
  uploadImageView: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  image: {
    width: "100%",
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
    overflow: "hidden", // for image,
    fontSize: 16,
  },
});
