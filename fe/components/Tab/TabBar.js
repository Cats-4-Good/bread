import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabBar({ state, descriptors, navigation }) {
	return (
		<View style={styles.navBar}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (isFocused) {
						if (navigation.canGoBack()) {
							navigation.goBack();
						}
					} else if (!event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key,
					});
				};

				let iconName;
				if (route.name === "HomeTab") {
					iconName = "home";
				} else if (route.name === "FavouriteTab") {
					iconName = "star";
				} else if (route.name === "ProfileTab") {
					iconName = "person";
				}

				return (
					<TouchableOpacity
						key={route.key}
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={styles.navItem}
					>
						<MaterialIcons name={iconName} size={24} color={isFocused ? "black" : "grey"} />
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	navBar: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		height: 85,
		borderTopWidth: 1,
		borderTopColor: "#ddd",
		backgroundColor: "#fff",
	},
	navItem: {
		justifyContent: "center",
		alignItems: "center",
		width: 50,
		height: 50,
	},
});
