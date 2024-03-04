import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { Home, Splash, ItemsScreen, Item, Upload } from "../Screens";

const Navigator = createStackNavigator();

const Stack = () => {
  return (
    <Navigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Navigator.Screen name="Splash" component={Splash} />
      <Navigator.Screen name="Home" component={Home} />
      <Navigator.Screen name="ItemsScreen" component={ItemsScreen} />
      <Navigator.Screen name="Item" component={Item} />
      <Navigator.Screen name="Upload" component={Upload} />
    </Navigator.Navigator>
  );
};

export default Stack;
