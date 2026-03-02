// Main logic file for vehicles category
import { baseInitialFormData } from '../../../shared/components/logic/mainLogic';

export const initialFormData = {
  // Step 1: Address Information and Step 3: Payment Details and Images
  ...baseInitialFormData,
  
  // Step 2: Vehicles Details (specific to vehicles)
  vehicles: [
    {
      id: 1,
      type: "",
      name: "",
      model: "",
      seatCapacity: "",
      fuelType: "",
      // AC pricing
      ac_charge_per_day: "",
      ac_charge_per_km: "",
      ac_waiting_charge_per_hour: "",
      ac_waiting_charge_per_night: "",
      ac_fixed: false,
      // Non-AC pricing
      nonac_charge_per_day: "",
      nonac_charge_per_km: "",
      nonac_waiting_charge_per_hour: "",
      nonac_waiting_charge_per_night: "",
      nonac_fixed: false
    }
  ],
  images: []
};