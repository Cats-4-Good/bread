import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Platform, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import MapCentraliseButton from "@/components/map/MapCentraliseButton";
import { ThemedButton, ThemedText } from "@/components";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

interface Bakery {
  name: string;
  location: string;
  status: string;
  lat: number;
  lng: number;
  place_id: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
}

export default function Map() {
  const mapRef = useRef(null);

  const [bakery, setBakery] = useState<Bakery | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [initialRegion, setInitialRegion] = useState<Region>();
  const [selectedButton, setSelectedButton] = useState<"map" | "list">("list");

  const [markers, setMarkers] = useState<Bakery[]>([]);

  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const API_URL = "xxx/api";
  const API_URL = "https://da75-116-15-47-239.ngrok-free.app/api";

  const getMarkers = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`${API_URL}/bakeries/${latitude}/${longitude}/${500}`);
      const data = await response.json();
      setMarkers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      setLocation(loc.coords);
      setInitialRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      getMarkers(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // run every 500ms to prevent excessive api calls
    timeoutRef.current = setTimeout(async () => {
      getMarkers(region.latitude, region.longitude);
    }, 500);
  };

  if (isError) {
    return (
      <View style={styles.container}>
        <ThemedText type="default">Permission to access location was denied</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "list" ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => setSelectedButton("list")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === "list" ? styles.buttonTextSelected : styles.buttonTextUnselected,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "map" ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => setSelectedButton("map")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === "map" ? styles.buttonTextSelected : styles.buttonTextUnselected,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>
      {selectedButton === "map" && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            onRegionChangeComplete={handleRegionChangeComplete}
            userInterfaceStyle="dark"
          >
            {markers.length > 0 &&
              markers.map((marker) => (
                <Marker
                  coordinate={{
                    latitude: marker.lat,
                    longitude: marker.lng,
                  }}
                  key={marker.place_id}
                  tracksViewChanges={false}
                  image={require("@/assets/images/map-icon-light.png")}
                  onPress={() => setBakery(marker)}
                />
              ))}
          </MapView>
          {location && (
            <MapCentraliseButton mapRef={mapRef} location={location} getMarkers={getMarkers} />
          )}
        </View>
      )}
      {selectedButton === "list" && (
        <View style={styles.listContainer}>
          <ThemedText type="default">List View (to be completed)</ThemedText>
        </View>
      )}
      <Modal isVisible={!!bakery} onBackdropPress={() => setBakery(null)} hasBackdrop>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{bakery?.name}</Text>
          <Text style={styles.modalText}>{bakery?.vicinity}</Text>
          <ThemedButton
            type="primary"
            style={{ paddingVertical: 16 }}
            onPress={() => {
              setBakery(null);
              router.push({
                pathname: `/${bakery?.name}`,
                params: { ...bakery },
              });
            }}
          >
            View bakery posts
          </ThemedButton>
          <Text style={{ fontWeight: "300", alignSelf: "center" }}>
            {3} live posts, {50} archived posts
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mapContainer: {
    flex: 12,
  },
  listContainer: {
    flex: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: Colors.accent,
  },
  buttonUnselected: {
    backgroundColor: Colors.white,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextSelected: {
    color: Colors.white,
  },
  buttonTextUnSelected: {
    color: Colors.black,
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
    shadowColor: Colors.black,
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
