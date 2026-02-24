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
import PropertiesList from '../screens/residential/tenant';
import PropertyDetails from '../screens/residential/tenant/PropertyDetails';
import TenantDetails from '../screens/residential/tenant/TenantDetails';
import BusinessPropertiesList from '../screens/business/tenant/PropertiesList';
import BusinessPropertyDetails from '../screens/business/tenant/PropertyDetails';
// Import all admin components
import { 
  AdminDashboard,
  SignupPage,
  LoginPage,
  ResidentialOwnerPage,
  ResidentialTenantPage,
  BusinessOwnerPage,
  BusinessTenantPage,
  VehiclesOwnerPage,
  VehiclesTenantPage,
  MachineryOwnerPage,
  MachineryTenantPage,
  ConditionsPage
} from '../screens/admin';

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
        <Stack.Screen name="PropertiesList" component={PropertiesList} />
        <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
        <Stack.Screen name="TenantDetails" component={TenantDetails} />
        <Stack.Screen name="BusinessPropertyDetails" component={BusinessPropertyDetails} />
        {/* Admin screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="SignupPage" component={SignupPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="ResidentialOwnerPage" component={ResidentialOwnerPage} />
        <Stack.Screen name="ResidentialTenantPage" component={ResidentialTenantPage} />
        <Stack.Screen name="BusinessOwnerPage" component={BusinessOwnerPage} />
        <Stack.Screen name="BusinessTenantPage" component={BusinessTenantPage} />
        <Stack.Screen name="VehiclesOwnerPage" component={VehiclesOwnerPage} />
        <Stack.Screen name="VehiclesTenantPage" component={VehiclesTenantPage} />
        <Stack.Screen name="MachineryOwnerPage" component={MachineryOwnerPage} />
        <Stack.Screen name="MachineryTenantPage" component={MachineryTenantPage} />
        <Stack.Screen name="ConditionsPage" component={ConditionsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}