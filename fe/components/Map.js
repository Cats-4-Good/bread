import { useState, useEffect } from "react";
import { Button, StyleSheet, View, Text, Platform, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

export default function Map({ navigation }) {
	const [location, setLocation] = useState(null);
	const [isError, setIsError] = useState(false);

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
		})();
	}, []);

	let initialRegion;

	if (location) {
		initialRegion = {
			latitude: location.latitude,
			longitude: location.longitude,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
		};
	}

	return (
		<View style={styles.container}>
			{isError ? (
				<Text>Permission to access location was denied</Text>
			) : (
				<MapView
					provider={MapView.PROVIDER_GOOGLE}
					style={styles.map}
					initialRegion={initialRegion}
					showsUserLocation={true}
				>
					{location && (
						<Marker
							coordinate={{
								latitude: location.latitude,
								longitude: location.longitude,
							}}
						>
							<Callout style={styles.callout}>
								<View style={styles.calloutContainer}>
									<Text style={styles.calloutTitleText}>Justin's Buns</Text>
									<Text style={styles.calloutAddressText}>
										1 Sengkang Square, #B1-19, Singapore 1 Sengkang Square, #B1-19, Singapore
									</Text>
									<TouchableOpacity
										accessibilityRole="button"
										style={styles.calloutButton}
										onPress={() => navigation.navigate("Bakery")}
									>
										<Text style={styles.calloutButtonText}>View bakery posts</Text>
									</TouchableOpacity>
								</View>
							</Callout>
						</Marker>
					)}
				</MapView>
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
		backgroundColor: "lightblue",
		paddingHorizontal: 5,
		paddingVertical: 7,
		borderRadius: 7,
		width: "100%",
		marginTop: 2,
	},
	calloutButtonText: {
		textAlign: "center",
		fontSize: 14,
		color: "white",
	},
});
