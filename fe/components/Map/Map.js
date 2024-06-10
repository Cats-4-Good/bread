import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import MapView from "react-native-maps";

import * as Location from "expo-location";
import MapMarker from "./MapCallout";
import MapCentraliseButton from "./MapCentraliseButton";

export default function Map({ navigation }) {
	const mapRef = useRef(null);

	const [location, setLocation] = useState(null);
	const [isError, setIsError] = useState(false);
	const [initialRegion, setInitialRegion] = useState(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== "granted") {
				setIsError(true);
				return;
			}

			let location = await Location.getCurrentPositionAsync({
				accuracy: Platform.OS == "android" ? Location.Accuracy.Low : Location.Accuracy.Lowest,
			});
			console.log(location);

			setLocation(location.coords);
			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			});
		})();
	}, []);

	return (
		<View style={styles.container}>
			{isError ? (
				<Text>Permission to access location was denied</Text>
			) : (
				<>
					<MapView
						ref={mapRef}
						provider={MapView.PROVIDER_GOOGLE}
						style={styles.map}
						initialRegion={initialRegion}
						showsUserLocation={true}
					>
						{location && <MapMarker location={location} navigation={navigation} />}
					</MapView>
					<MapCentraliseButton mapRef={mapRef} location={location} />
				</>
			)}
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
