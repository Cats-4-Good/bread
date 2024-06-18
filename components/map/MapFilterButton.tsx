import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationObjectCoords } from "expo-location";

import { ThemedButton } from "../ThemedButton";

interface Props {
  markers: LocationObjectCoords[];
  setMarkers: (markers: LocationObjectCoords[]) => void;
}

export default function MapFilterButton({ markers, setMarkers }: Props) {
  const handleFilterMarkers = () => {};

  return (
    <ThemedButton
      type="round"
      style={styles.centerButton}
      onPress={handleFilterMarkers}
    >
      <FontAwesome5 name="filter" size={20} color="white" />
    </ThemedButton>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    position: "absolute",
    bottom: 80,
    right: 14,
  },
});
