import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationObjectCoords } from "expo-location";

import { ThemedButton } from "../ThemedButton";

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
        zoom: 1500,
        altitude: 1500,
      });
    }
  };

  return (
    <ThemedButton
      type="round"
      style={styles.centerButton}
      onPress={handleCenterMap}
    >
      <FontAwesome5 name="location-arrow" size={20} color="white" />
    </ThemedButton>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },
});
