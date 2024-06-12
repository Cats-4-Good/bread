import { LocationObjectCoords } from "expo-location";
import { router } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Marker, Callout } from "react-native-maps";

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
          router.push(`/${tempBakery.name}`);
        }}
      >
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitleText}>{tempBakery.name}</Text>
          <Text style={styles.calloutAddressText}>{tempBakery.location}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.calloutButton}
            onPress={() => {
              router.push(`/${tempBakery.name}`);
            }}
          >
            <Text style={styles.calloutButtonText}>View bakery posts</Text>
          </TouchableOpacity>
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
  calloutButton: {
    backgroundColor: "#cf9c61",
    paddingHorizontal: 5,
    paddingVertical: 9,
    borderRadius: 7,
    width: "100%",
    marginTop: 5,
  },
  calloutButtonText: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
});
