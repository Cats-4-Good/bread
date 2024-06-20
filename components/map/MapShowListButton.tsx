import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "../ThemedButton";

interface Props {
  setSelectedButton: React.Dispatch<React.SetStateAction<"list" | "map">>;
}

export default function MapShowListButton({ setSelectedButton }: Props) {
  const handleCenterMap = () => {
    setSelectedButton("list");
  };

  return (
    <ThemedButton type="round" style={styles.centerButton} onPress={handleCenterMap}>
      <Ionicons name="arrow-back-outline" size={20} color="white" />
    </ThemedButton>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    position: "absolute",
    top: 20,
    left: 14,
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
