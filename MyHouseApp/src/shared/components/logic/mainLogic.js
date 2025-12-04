// Main logic file that combines all step logic
import { step1InitialData } from './step1Logic';
import { step3InitialData } from './step3Logic';

// Base initial form data that can be extended by each category
export const baseInitialFormData = {
  // Step 1: Address Information
  ...step1InitialData,
  
  // Step 3: Payment Details and Images
  ...step3InitialData,
};