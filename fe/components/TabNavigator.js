import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import BakeryScreen from "../screens/BakeryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewPostScreen from "../screens/NewPostScreen";

import TabBar from "./TabBar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
	headerStyle: {
		backgroundColor: "#577B77",
	},
	headerTintColor: "#fff",
	headerTitleStyle: {
		fontWeight: "bold",
	},
};

function HomeStack() {
	return (
		<Stack.Navigator screenOptions={screenOptions}>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Bakery" component={BakeryScreen} />
			<Stack.Screen name="New Post" component={NewPostScreen} />
		</Stack.Navigator>
	);
}

function ProfileStack() {
	return (
		<Stack.Navigator screenOptions={screenOptions}>
			<Stack.Screen name="Profile" component={ProfileScreen} />
		</Stack.Navigator>
	);
}

export default function TabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ route }) => ({
				headerShown: false,
				activeTintColor: "#f4511e",
				inactiveTintColor: "gray",
				tabBarIcon: ({ color, size }) => {
					let iconName;

					if (route.name === "Home") {
						iconName = "home";
					} else if (route.name === "Starred") {
						iconName = "star";
					} else if (route.name === "Profile") {
						iconName = "person";
					}

					return <MaterialIcons name={iconName} size={size} color={color} />;
				},
			})}
			tabBar={(props) => <TabBar {...props} />}
		>
			<Tab.Screen name="HomeTab" component={HomeStack} />
			<Tab.Screen name="ProfileTab" component={ProfileStack} />
		</Tab.Navigator>
	);
}
