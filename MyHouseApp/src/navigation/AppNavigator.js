import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/login';
import Signup from '../screens/signup';
import Dummy from '../screens/dummy';
import Home from '../screens/home';
import Residential from '../screens/residential';
import Business from '../screens/business';
import Vehicles from '../screens/vehicles';
import Machinery from '../screens/machinery';
import AddHouse from '../screens/residential/index';
import AddBusiness from '../screens/business/index';
import AddMachinery from '../screens/machinery/index';
import AddVehicles from '../screens/vehicles/index';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dummy" component={Dummy} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Residential" component={Residential} />
        <Stack.Screen name="AddHouse" component={AddHouse} />
        <Stack.Screen name="Business" component={Business} />
        <Stack.Screen name="AddBusiness" component={AddBusiness} />
        <Stack.Screen name="Vehicles" component={Vehicles} />
        <Stack.Screen name="AddVehicles" component={AddVehicles} />
        <Stack.Screen name="Machinery" component={Machinery} />
        <Stack.Screen name="AddMachinery" component={AddMachinery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}