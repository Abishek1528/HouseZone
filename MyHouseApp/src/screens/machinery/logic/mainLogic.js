// Main logic file for machinery category
import { baseInitialFormData } from '../../../shared/components/logic/mainLogic';

export const initialFormData = {
  // Step 1: Address Information and Step 3: Payment Details and Images
  ...baseInitialFormData,
  
  // Step 2: Machinery Details (specific to machinery)
  machinery: [{ id: 1, type: "", name: "", model: "" }],
};