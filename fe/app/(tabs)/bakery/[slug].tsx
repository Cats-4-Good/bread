import BakeryList from "@/components/bakery/BakeryList";
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function BakeryScreen() {
  const { slug } = useLocalSearchParams();

  return <Text>Blog post: {slug}</Text>;
  // return (
  //   <BakeryList />
  // );
};

