// Main logic file that combines all step logic
import { baseInitialFormData } from '../../../shared/components/logic/mainLogic';
import { step2InitialData } from './step2Logic';

export const initialFormData = {
  // Step 1: Address Information and Step 3: Payment Details and Images
  ...baseInitialFormData,
  
  // Step 2: House Details
  ...step2InitialData,
};