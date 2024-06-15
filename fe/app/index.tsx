import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import MapCentraliseButton from "@/components/map/MapCentraliseButton";
import { ThemedButton, ThemedText } from "@/components";
import Modal from "react-native-modal";
import { router } from "expo-router";

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

export default function Map() {
  const mapRef = useRef(null);

  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [markers, setMarkers] = useState<Location.LocationObjectCoords[]>([]);
  const [isError, setIsError] = useState(false);
  const [initialRegion, setInitialRegion] = useState<Region>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [bakery, setBakery] = useState<Bakery | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setIsError(true);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy:
          Platform.OS == "android"
            ? Location.LocationAccuracy.Low
            : Location.LocationAccuracy.Lowest,
      });
      console.log(loc);

      setLocation(loc.coords);
      setInitialRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // run every 500ms to prevent excessive api calls
    timeoutRef.current = setTimeout(() => {
      console.log("MOVED:", region);
    }, 500);
  };

  if (isError) {
    return (
      <View style={styles.container}>
        <ThemedText type="default">
          Permission to access location was denied
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              tracksViewChanges={false}
              image={require("@/assets/images/map-icon-light.png")}
              onPress={() => setBakery(tempBakery)}
            />
          )}
        </MapView>

        {location && (
          <MapCentraliseButton mapRef={mapRef} location={location} />
        )}

        <Modal
          isVisible={!!bakery}
          onBackdropPress={() => setBakery(null)}
          hasBackdrop
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{bakery?.name}</Text>
            <Text style={styles.modalText}>{bakery?.location}</Text>
            <ThemedButton
              type="primary"
              style={{ paddingVertical: 16 }}
              onPress={() => {
                setBakery(null);
                router.push(`/${bakery?.name}`);
              }}
            >
              View bakery posts
            </ThemedButton>
            <Text style={{ fontWeight: "300", alignSelf: "center" }}>
              {3} live posts, {50} archived posts
            </Text>
          </View>
        </Modal>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 340,
    gap: 14,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
});
