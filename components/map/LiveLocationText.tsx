import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";


const LiveLocationText = () => {
  const [color, setColor] = useState(Colors.black);
  const [backgroundColor, setBackgroundColor] = useState(Colors.grayLight);

  useEffect(() => {
    const interval = setInterval(() => {
      setColor((prevColor) => (prevColor === Colors.black ? Colors.red : Colors.black));
      setBackgroundColor((prevColor) =>
        prevColor === Colors.grayLight ? Colors.primary : Colors.grayLight
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.gpsIconContainer, { backgroundColor }]}>
      <Entypo name="location-pin" size={16} color={color} />
      <ThemedText style={[styles.gpsText, { color }]}>Using live location...</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  gpsIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
    borderColor: Colors.grayLight,
    borderWidth: 1,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  gpsText: {
    fontSize: 12,
    marginLeft: 3,
    fontWeight: "bold",
  },
});

export default LiveLocationText;
