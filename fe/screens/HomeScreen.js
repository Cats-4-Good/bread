import { StyleSheet, View } from "react-native";

import Map from "../components/Map/Map";

export default function HomeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<View style={styles.mapContainer}>
				<Map navigation={navigation} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mapContainer: {
		flex: 1,
		backgroundColor: "grey",
	},
});
