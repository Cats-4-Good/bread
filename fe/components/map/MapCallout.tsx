import { LocationObjectCoords } from "expo-location";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Marker, Callout } from "react-native-maps";

import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "../ThemedText";

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
      tracksViewChanges={false}
      image={require("../../assets/images/map-icon-light.png")}
    >
      <Callout
        style={styles.callout}
        onPress={() => {
          router.navigate(`/(tabs)/bakery/${tempBakery.name}`);
        }}
      >
        <View style={styles.calloutContainer}>
          <ThemedText type="defaultSemiBold">{tempBakery.name}</ThemedText>
          <ThemedText type="default" style={styles.calloutAddressText}>
            {tempBakery.location}
          </ThemedText>
          <ThemedButton
            type="primary"
            onPress={() => {
              router.navigate(`/(tabs)/bakery/${tempBakery.name}`);
            }}
            style={styles.calloutButton}
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
    padding: 3,
  },
  calloutContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  calloutAddressText: {
    marginVertical: 5,
  },
  calloutButton: {
    marginTop: 5,
    width: "100%",
  },
});
