import { Alert } from "react-native";

export const ADMIN_OWNER_SCREENS = {
  residential: "ResidentialOwnerPage",
  business: "BusinessOwnerPage",
  vehicles: "VehiclesOwnerPage",
  machinery: "MachineryOwnerPage",
};

/** Navigate from a tenant submission card to the matching owner listing, focused on one property. */
export function navigateToOwnerProperty(navigation, category, propertyId) {
  const screen = ADMIN_OWNER_SCREENS[category];
  if (!screen) {
    Alert.alert("Error", "Unknown property category.");
    return;
  }
  if (propertyId == null || propertyId === "") {
    Alert.alert("No property", "This submission is not linked to a property yet.");
    return;
  }
  navigation.navigate(screen, { propertyId: String(propertyId) });
}
