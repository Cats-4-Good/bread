import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import MapCentraliseButton from "@/components/map/MapCentraliseButton";
import MapCallout from "@/components/map/MapCallout";

export default function Map() {
  const mapRef = useRef(null);

  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [isError, setIsError] = useState(false);
  const [initialRegion, setInitialRegion] = useState<Region>();

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

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Permission to access location was denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {location && <MapCallout location={location} />}
        </MapView>
        {location && <MapCentraliseButton mapRef={mapRef} location={location} />}
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
});

