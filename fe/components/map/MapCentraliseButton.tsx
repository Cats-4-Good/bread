import { StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationObjectCoords } from "expo-location";

interface Props {
  mapRef: any;
  location: LocationObjectCoords;
}
export default function MapCentraliseButton({ mapRef, location }: Props) {
  const handleCenterMap = () => {
    if (mapRef.current && location) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.centerButton} onPress={handleCenterMap}>
      <FontAwesome5 name="location-arrow" size={16} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "#cf9c61",
    padding: 18,
    borderRadius: 25,
  },
});
