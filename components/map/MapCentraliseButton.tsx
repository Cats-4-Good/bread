import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationObjectCoords } from "expo-location";
import { Region } from "react-native-maps";

import { ThemedButton } from "../ThemedButton";

interface Props {
  mapRef: any;
  location: LocationObjectCoords;
  setLatestRegion: React.Dispatch<React.SetStateAction<Region | undefined>>;
  style?: any;
}

export default function MapCentraliseButton({ mapRef, location, setLatestRegion, style }: Props) {
  const handleCenterMap = async () => {
    if (mapRef.current && location) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      setLatestRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  return (
    <ThemedButton type="round" style={[styles.centerButton, style]} onPress={handleCenterMap}>
      <FontAwesome5 name="location-arrow" size={20} color="white" />
    </ThemedButton>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    position: "absolute",
    bottom: 80,
    right: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});
