import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";

import { Entypo } from "@expo/vector-icons";

import BakeryPost from "../components/Bakery/BakeryPost";

const BakeryScreen = ({ navigation }) => {
	const listings = [
		{
			name: "Croissant",
			price: "1 for $1",
			datetime: "45 mins ago",
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
				style={styles.bakeryImage}
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
				renderItem={({ item }) => <BakeryPost item={item} navigation={navigation} />}
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
	bakeryImage: {
		width: "100%",
		aspectRatio: 2,
		maxHeight: 200,
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
});

export default BakeryScreen;
