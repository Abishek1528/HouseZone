import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from '../../styles/categoryContentStyles';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Step1Address from './Step1Address';
import Step3PaymentImages from './Step3PaymentImages';
import { handleStep1InputChange } from './logic/step1Logic';
import { handleImageSelect, handleRemoveImage } from './logic/step3Logic';
import { handleNext, handlePrevious } from './logic/navigationLogic';

const BaseForm = ({ 
  title, 
  step2Component: Step2Component, 
  initialFormData, 
  validationFunction, 
  successMessage, 
  navigationTarget,
  category // Added category prop to identify the form type
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params || { role: "Owner" };

  // State for form steps
  const [step, setStep] = useState(1);
  
  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // Handle input changes for Step 1
  const handleStep1Change = handleStep1InputChange(formData, setFormData);

  // Handle input changes for Step 2 (using the existing function)
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle image selection
  const handleImageSelection = handleImageSelect(formData, setFormData);

  // Handle image removal
  const handleImageRemoval = handleRemoveImage(formData, setFormData);

  // Validate step 1 separately
  const validateStep1 = () => {
    if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
        !formData.area || !formData.city || !formData.contactNo) {
      Alert.alert("Validation Error", "Please fill in all required fields in Step 1");
      return false;
    }
    return true;
  };

  // Validate step 2 separately (will be overridden by specific form validation)
  const validateStep2 = () => {
    // This will be replaced by the specific validation function passed as prop
    return true;
  };

  // Validate step 3 separately
  const validateStep3 = () => {
    if (!formData.advanceAmount || !formData.rentAmount) {
      Alert.alert("Validation Error", "Please fill in all required fields in Step 3");
      return false;
    }
    return true;
  };

  // Handle saving step 1 data
  const handleSaveStep1 = async () => {
    // Validate Step 1 fields
    if (!validateStep1()) {
      return;
    }
    
    // If this is a residential form, save step 1 data to the database
    if (category === "residential") {
      try {
        // Prepare step 1 data for submission
        const step1Data = {
          name: formData.name,
          doorNo: formData.doorNo,
          street: formData.street,
          pincode: formData.pincode,
          area: formData.area,
          city: formData.city,
          contactNo: formData.contactNo
        };
        
        // Import the API function dynamically
        const { saveResidentialStep1 } = await import('../../screens/residential/logic/api');
        
        // Save step 1 data to the database
        const response = await saveResidentialStep1(step1Data);
        
        console.log("Step 1 data saved successfully with ID:", response.id);
        
        // Store the ID in formData for potential future use
        setFormData({
          ...formData,
          residentialId: response.id
        });
        
        // Don't show success message for step 1 save
      } catch (error) {
        console.error("Error saving step 1 data:", error);
        Alert.alert("Error", "Failed to save step 1 data: " + error.message);
      }
    }
  };

  // Handle form submission (for final submit) - validate all steps separately
  const handleFormSubmit = async () => {
    // Validate step 1
    if (!validateStep1()) {
      setStep(1); // Go back to step 1 to show the error
      return;
    }
    
    // Validate step 2 using the provided validation function
    if (validationFunction) {
      // Temporarily set step 2 data for validation
      const isValid = validationFunction(formData);
      if (!isValid) {
        setStep(2); // Go back to step 2 to show the error
        return;
      }
    } else {
      // Default validation for step 2
      if (!validateStep2()) {
        setStep(2); // Go back to step 2 to show the error
        return;
      }
    }
    
    // Validate step 3
    if (!validateStep3()) {
      setStep(3); // Go back to step 3 to show the error
      return;
    }
    
    // If all validations pass, save step 1, step 2, and step 3 data if it's residential form
    if (category === "residential") {
      try {
        // Save step 1 data first
        // Prepare step 1 data for submission
        const step1Data = {
          name: formData.name,
          doorNo: formData.doorNo,
          street: formData.street,
          pincode: formData.pincode,
          area: formData.area,
          city: formData.city,
          contactNo: formData.contactNo
        };
        
        // Import the API function dynamically
        const { saveResidentialStep1 } = await import('../../screens/residential/logic/api');
        
        // Save step 1 data to the database
        const step1Response = await saveResidentialStep1(step1Data);
        
        console.log("Step 1 data saved successfully with ID:", step1Response.id);
        
        // Store the ID in formData for step 2 and step 3 submission
        const roNo = step1Response.id;
        
        // Now save step 2 data
        try {
          // Prepare step 2 data for submission
          const step2Data = {
            roNo: roNo,
            facingDirection: formData.facingDirection,
            hallLength: formData.hallLength,
            hallBreadth: formData.hallBreadth,
            noOfBedrooms: formData.noOfBedrooms,
            kitchenLength: formData.kitchenLength,
            kitchenBreadth: formData.kitchenBreadth,
            noOfBathrooms: formData.noOfBathrooms,
            bathroom1Type: formData.bathroom1Type,
            floorNo: formData.floorNo,
            bedrooms: []
          };
          
          // Add bedroom data based on number of bedrooms
          const numBedrooms = parseInt(formData.noOfBedrooms);
          if (numBedrooms >= 1) {
            step2Data.bedrooms.push({
              number: 1,
              length: formData.bedroom1Length,
              breadth: formData.bedroom1Breadth
            });
          }
          if (numBedrooms >= 2) {
            step2Data.bedrooms.push({
              number: 2,
              length: formData.bedroom2Length,
              breadth: formData.bedroom2Breadth
            });
          }
          if (numBedrooms >= 3) {
            step2Data.bedrooms.push({
              number: 3,
              length: formData.bedroom3Length,
              breadth: formData.bedroom3Breadth
            });
          }
          
          // Import the step 2 API function dynamically
          const { saveResidentialStep2 } = await import('../../screens/residential/logic/api');
          
          // Save step 2 data to the database
          await saveResidentialStep2(step2Data);
          
          console.log("Step 2 data saved successfully");
          
          // Now save step 3 data
          try {
            // Prepare step 3 data for submission
            const step3Data = {
              roNo: roNo,
              advanceAmount: formData.advanceAmount,
              monthlyRent: formData.rentAmount
            };
            
            // Import the step 3 API function dynamically
            const { saveResidentialStep3 } = await import('../../screens/residential/logic/api');
            
            // Save step 3 data to the database
            await saveResidentialStep3(step3Data);
            
            console.log("Step 3 data saved successfully");
            
            // Show only one success message for house details saved
            Alert.alert(
              "Success",
              successMessage, // "House details added successfully!"
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate(navigationTarget, { role: "Owner" })
                }
              ]
            );
          } catch (step3Error) {
            console.error("Error saving step 3 data:", step3Error);
            Alert.alert("Error", "Failed to save step 3 data: " + step3Error.message);
            return;
          }
        } catch (step2Error) {
          console.error("Error saving step 2 data:", step2Error);
          Alert.alert("Error", "Failed to save step 2 data: " + step2Error.message);
          return;
        }
      } catch (step1Error) {
        console.error("Error saving step 1 data:", step1Error);
        Alert.alert("Error", "Failed to save step 1 data: " + step1Error.message);
        return;
      }
    } else {
      // For non-residential forms, show success message directly
      Alert.alert(
        "Success",
        successMessage,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate(navigationTarget, { role: "Owner" })
          }
        ]
      );
    }
  };

  // Handle next step (without validation)
  const handleNextStep = () => {
    handleNext(step, setStep, () => {}); // Empty function since we don't want validation on next
  };

  // Handle previous step
  const handlePrevStep = () => {
    handlePrevious(step, setStep);
  };

  // Render step 1: Address Information
  const renderStep1 = () => (
    <Step1Address 
      formData={formData} 
      handleInputChange={handleStep1Change} 
    />
  );

  // Render step 2: Passed as a prop
  const renderStep2 = () => (
    <Step2Component 
      formData={formData} 
      handleInputChange={handleInputChange} 
    />
  );

  // Render step 3: Payment Details and Images
  const renderStep3 = () => (
    <Step3PaymentImages 
      formData={formData} 
      handleInputChange={handleInputChange} 
      handleImageSelect={handleImageSelection}
      handleRemoveImage={handleImageRemoval}
    />
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* Progress Indicator */}
      <View style={categoryContentStyles.progressContainer}>
        <Text style={categoryContentStyles.progressText}>Step {step} of 3</Text>
      </View>
      
      {/* CONTENT */}
      <View style={[categoryContentStyles.content, { paddingHorizontal: 20, width: '100%' }]}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        {/* Navigation Buttons */}
        <View style={categoryContentStyles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity 
              style={[categoryContentStyles.button, categoryContentStyles.cancelButton]} 
              onPress={handlePrevStep}
            >
              <Text style={categoryContentStyles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {/* Save button for step 1 - positioned on the left side */}
          {step === 1 && (
            <TouchableOpacity 
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
              onPress={handleSaveStep1}
            >
              <Text style={categoryContentStyles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
          
          {/* Spacer to push Next/Submit button to the right */}
          <View style={{ flex: 1 }} />
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={step < 3 ? handleNextStep : handleFormSubmit}
          >
            <Text style={categoryContentStyles.buttonText}>{step < 3 ? "Next" : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
};

export default BaseForm;