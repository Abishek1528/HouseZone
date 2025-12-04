// Main logic file for business category
import { baseInitialFormData } from '../../../shared/components/logic/mainLogic';

export const initialFormData = {
  // Step 1: Address Information and Step 3: Payment Details and Images
  ...baseInitialFormData,
  
  // Step 2: Business Details (specific to business)
  businessType: "",
  businessName: "",
  registrationNumber: "",
  yearEstablished: "",
  numberOfEmployees: "",
  annualRevenue: "",
};