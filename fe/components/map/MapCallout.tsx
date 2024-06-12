import { LocationObjectCoords } from "expo-location";
import { router } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Marker, Callout } from "react-native-maps";

import { ThemedButton } from "../ThemedButton";

interface MapCalloutProps {
  location: LocationObjectCoords;
}

interface Bakery {
  id: number;
  name: string;
  location: string;
}

const tempBakery: Bakery = {
  id: 1,
  name: "Justin's Buns",
  location: "1 Sengkang Square, #B1-19, Singapore",
};

export default function MapCallout({ location }: MapCalloutProps) {
  return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      style={{
        position: "absolute",
        bottom: 50,
        left: 50,
      }}
    >
      <Callout
        style={styles.callout}
        onPress={() => {
          router.navigate(`/(tabs)/bakery/${tempBakery.name}`);
        }}
      >
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitleText}>{tempBakery.name}</Text>
          <Text style={styles.calloutAddressText}>{tempBakery.location}</Text>
          <ThemedButton
            type="primary"
            text="View bakery posts"
            onPress={() => {
              router.navigate(`/(tabs)/bakery/${tempBakery.name}`);
            }}
            style={{ marginTop: 5 }}
          >
            View bakery posts
          </ThemedButton>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  callout: {
    width: 300,
    padding: 5,
  },
  calloutContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  calloutTitleText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  calloutAddressText: {
    fontSize: 14,
    marginVertical: 5,
  },
});
