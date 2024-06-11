import { NavigationContainer } from "@react-navigation/native";

import TabNavigator from "./components/Tab/TabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
