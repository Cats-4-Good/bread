import { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import BakeryList from "@/components/bakery/BakeryList";

export default function BakeryScreen() {
	const { slug } = useLocalSearchParams();
	const navigation = useNavigation();

	useEffect(() => {
		if (slug) {
			navigation.setOptions({ title: decodeURIComponent(slug as string) });
		}
	}, [slug]);

	return <BakeryList />;
}
