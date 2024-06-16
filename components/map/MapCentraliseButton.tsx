import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationObjectCoords } from "expo-location";

import { ThemedButton } from "../ThemedButton";

interface Props {
  mapRef: any;
  location: LocationObjectCoords;
  getMarkers: (latitude: number, longitude: number) => void;
}

export default function MapCentraliseButton({ mapRef, location, getMarkers }: Props) {
  const handleCenterMap = async () => {
    if (mapRef.current && location) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 2000,
        altitude: 2000,
      });
      getMarkers(location.latitude, location.longitude);
    }
  };

  return (
    <ThemedButton type="round" style={styles.centerButton} onPress={handleCenterMap}>
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
