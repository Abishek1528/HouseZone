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
      acAvailable: false,
      chargeType: "",
      chargeAmount: ""
    }
  ],
};