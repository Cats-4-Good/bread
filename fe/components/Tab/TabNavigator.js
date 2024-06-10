import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { MaterialIcons } from "@expo/vector-icons";

import TabBar from "./TabBar";

import HomeScreen from "../../screens/HomeScreen";
import BakeryScreen from "../../screens/BakeryScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import FavouriteScreen from "../../screens/FavouriteScreen";
import NewPostScreen from "../../screens/NewPostScreen";

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
			<Stack.Screen
				name="Bakery"
				component={BakeryScreen}
				options={({ route }) => ({ title: route.params.bakeryName })}
			/>
			<Stack.Screen name="New Post" component={NewPostScreen} />
			<Stack.Screen name="User Profile" component={ProfileScreen} />
		</Stack.Navigator>
	);
}

function ProfileStack() {
	return (
		<Stack.Navigator screenOptions={screenOptions}>
			<Stack.Screen name="My Profile" component={ProfileScreen} />
		</Stack.Navigator>
	);
}

function FavouriteStack() {
	return (
		<Stack.Navigator screenOptions={screenOptions}>
			<Stack.Screen name="Favourite" component={FavouriteScreen} />
		</Stack.Navigator>
	);
}

export default function TabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="HomeTab"
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
			<Tab.Screen name="FavouriteTab" component={FavouriteStack} />
			<Tab.Screen name="ProfileTab" component={ProfileStack} />
		</Tab.Navigator>
	);
}
