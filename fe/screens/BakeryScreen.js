import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";

const BakeryScreen = ({ navigation }) => {
	const renderItem = ({ item }) => (
		<View style={styles.listItem}>
			<Image source={{ uri: item.image }} style={styles.listItemImage} />
			<View style={styles.listItemTextContainer}>
				<View style={styles.listHeader}>
					<View style={styles.listItemProfile}>
						<MaterialIcons name="person" size={16} color="black" />
					</View>
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

	const listings = [
		{
			name: "Croissant",
			price: "1 for $1",
			datetime: "45 minutes ago",
			description: "Bread is my life. i will die 1 day without bread :3",
			quantity: "10-20 left",
			image: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
		},
		{
			name: "Baguette",
			price: "$3.00",
			datetime: "3 hours ago",
			description: "Bread is my life. i will die 1 day without bread :3",
			quantity: null,
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOQpMd1VvFulMmL5eZzbby_LtusqbLCivDZA&s",
		},
	];

	return (
		<View style={styles.content}>
			<Image
				source={{
					uri: "https://www.shutterstock.com/image-photo/3d-render-cafe-bar-restaurant-600nw-1415138246.jpg",
				}}
				style={{ width: "100%", aspectRatio: 2, maxHeight: 200 }}
			/>
			<View>
				<TouchableOpacity style={styles.newPostButton} onPress={() => navigation.navigate("New Post")}>
					<Text style={styles.newPostButtonText}>
						New Post <Entypo name="plus" size={16} color="white" />
					</Text>
				</TouchableOpacity>
			</View>
			<FlatList
				data={listings}
				renderItem={renderItem}
				keyExtractor={(item, index) => index.toString()}
				style={styles.list}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	content: {
		width: "100%",
		height: "100%",
		backgroundColor: "#feedd3",
	},
	newPostButton: {
		backgroundColor: "#CF9C61",
		marginHorizontal: 20,
		marginVertical: 10,
		padding: 10,
		borderRadius: 15,
		alignSelf: "flex-start",
	},
	newPostButtonText: {
		color: "white",
		fontSize: 16,
	},
	list: {
		width: "auto",
		marginHorizontal: 20,
	},
	listItem: {
		flexDirection: "row",
		padding: 18,
		marginVertical: 5,
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
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		marginBottom: 5,
	},
});

export default BakeryScreen;
