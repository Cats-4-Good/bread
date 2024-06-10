import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Marker, Callout } from "react-native-maps";

export default function MapCallout({ navigation, location }) {
	return (
		<Marker
			coordinate={{
				latitude: location.latitude,
				longitude: location.longitude,
			}}
		>
			<Callout style={styles.callout}>
				<View style={styles.calloutContainer}>
					<Text style={styles.calloutTitleText}>Justin's Buns</Text>
					<Text style={styles.calloutAddressText}>1 Sengkang Square, #B1-19, Singapore</Text>
					<TouchableOpacity
						accessibilityRole="button"
						style={styles.calloutButton}
						onPress={() => navigation.navigate("Bakery", { bakeryName: "Justin's Buns" })}
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
