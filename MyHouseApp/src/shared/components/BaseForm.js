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
  navigationTarget 
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

<<<<<<< Updated upstream
  // Handle form submission
  const handleFormSubmit = () => {
    // Use the provided validation function or default validation
=======
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
    
    // Validate images - minimum 4 required
    const images = formData.images || [];
    if (images.length < 4) {
      Alert.alert("Validation Error", "Please add at least 4 images of your property");
      return false;
    }
    
    return true;
  };

  // Handle form submission (for final submit) - validate all steps separately
  const handleFormSubmit = async () => {
    // Validate step 1
    if (!validateStep1()) {
      setStep(1); // Go back to step 1 to show the error
      return;
    }
    
    // Validate step 2 using the provided validation function
>>>>>>> Stashed changes
    if (validationFunction) {
      const isValid = validationFunction(formData);
      if (!isValid) {
        return;
      }
    } else {
      // Default validation
      if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
          !formData.area || !formData.city || !formData.contactNo || !formData.advanceAmount || 
          !formData.rentAmount || formData.images.length < 4 || formData.images.length > 8) {
        Alert.alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
        return;
      }
    }
    
    // Here you would typically send the data to your backend
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
  };

  // Handle next step
  const handleNextStep = () => {
    handleNext(step, setStep, handleFormSubmit);
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
          
<<<<<<< Updated upstream
          {/* Spacer for first step to push Next button to the right */}
          {step === 1 && <View style={{ flex: 1 }} />}
=======
          {/* Spacer to push Next/Submit button to the right */}
          <View style={{ flex: 1 }} />
>>>>>>> Stashed changes
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleNextStep}
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