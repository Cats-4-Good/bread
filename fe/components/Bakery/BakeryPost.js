import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function BakeryPost({ navigation, item }) {
	return (
		<View style={styles.listItem}>
			<Image source={{ uri: item.image }} style={styles.listItemImage} />
			<View style={styles.listItemTextContainer}>
				<View style={styles.listHeader}>
					<TouchableWithoutFeedback onPress={() => navigation.navigate("User Profile")}>
						<View style={styles.listItemProfile}>
							<MaterialIcons name="person" size={16} color="black" />
						</View>
					</TouchableWithoutFeedback>

					<View>
						<Text>{item.datetime}</Text>
					</View>
				</View>
				<Text style={styles.listItemNameText}>{item.name}</Text>
				<Text style={styles.listItemDescriptionText}>{item.description}</Text>
				<View style={styles.listFooter}>
					<Text style={styles.listItemPriceText}>{item.price}</Text>
					{item.quantity && <Text style={styles.listItemText}>{item.quantity}</Text>}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	listItem: {
		flexDirection: "row",
		padding: 18,
		marginBottom: 10,
		backgroundColor: "white",
		borderRadius: 15,
		shadowOffset: { height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 3,
	},
	listItemProfile: {
		justifyContent: "center",
		alignItems: "center",
		width: 25,
		height: 25,
		borderRadius: 25,
		backgroundColor: "#eee",
	},
	listItemImage: {
		width: "40%",
		aspectRatio: 1,
		marginRight: 10,
		borderRadius: 15,
		borderColor: "#eae9e9",
		borderWidth: 1,
	},
	listItemText: {
		fontSize: 16,
	},
	listItemTextContainer: {
		width: "60%",
		padding: 2,
	},
	listItemPriceText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	listItemNameText: {
		fontSize: 17,
		fontWeight: "bold",
	},
	listItemDescriptionText: {
		fontSize: 16,
		paddingVertical: 4,
	},
	listFooter: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
	},
	listHeader: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
});
