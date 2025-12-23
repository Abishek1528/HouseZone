import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from "../../styles/categoryContentStyles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Step1Address from "./Step1Address";
import Step3PaymentImages from "./Step3PaymentImages";
import { handleStep1InputChange } from "./logic/step1Logic";
import { handleImageSelect, handleRemoveImage } from "./logic/step3Logic";
import { handleNext, handlePrevious } from "./logic/navigationLogic";

const BaseForm = ({
  title,
  step2Component: Step2Component,
  initialFormData,
  validationFunction,
  successMessage,
  navigationTarget,
  category
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params || { role: "Owner" };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1Change = handleStep1InputChange(formData, setFormData);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleImageSelection = handleImageSelect(formData, setFormData);
  const handleImageRemoval = handleRemoveImage(formData, setFormData);

  // VALIDATIONS
  const validateStep1 = () => {
    if (
      !formData.name ||
      !formData.doorNo ||
      !formData.street ||
      !formData.pincode ||
      !formData.area ||
      !formData.city ||
      !formData.contactNo
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields in Step 1");
      return false;
    }
    return true;
  };

  const validateStep2 = () => true;

  const validateStep3 = () => {
    if (!formData.advanceAmount || !formData.rentAmount) {
      Alert.alert("Validation Error", "Please fill in all required fields in Step 3");
      return false;
    }

    const images = formData.images || [];
    if (images.length < 4) {
      Alert.alert("Validation Error", "Please add at least 4 images of your property");
      return false;
    }
    return true;
  };

  // SAVE STEP 1 TO DB
  const handleSaveStep1 = async () => {
    if (!validateStep1()) return;

    if (category === "residential") {
      try {
        const step1Data = {
          name: formData.name,
          doorNo: formData.doorNo,
          street: formData.street,
          pincode: formData.pincode,
          area: formData.area,
          city: formData.city,
          contactNo: formData.contactNo
        };

        const { saveResidentialStep1 } = await import("../../screens/residential/logic/api");
        const response = await saveResidentialStep1(step1Data);

        setFormData({
          ...formData,
          residentialId: response.roNo
        });      } catch (error) {
        console.error("Error saving step 1:", error);
        Alert.alert("Error", "Failed to save step 1 data: " + (error.message || "Unknown error"));
      }
    }
  };

  // Handle next step WITHOUT saving data
  const handleNextStep = () => {
    // Just move to the next step without validation or saving
    handleNext(step, setStep, () => {});
  };

  const handlePrevStep = () => handlePrevious(step, setStep);

  // Handle going back to the previous screen
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Handle form submission (for final submit) - validate and save all steps
  const handleFormSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For vehicles category, we only have 2 steps (step3 is integrated into step2)
      const isVehiclesCategory = title === "Add Vehicle";
      
      if (isVehiclesCategory) {
        // For vehicles, validate step 1 and step 2 (which includes payment and images)
        if (!validateStep1()) {
          setStep(1);
          setIsSubmitting(false);
          return;
        }
        
        // Validate step 2 using the provided validation function
        if (validationFunction) {
          const isValid = validationFunction(formData);
          if (!isValid) {
            setStep(2);
            setIsSubmitting(false);
            return;
          }
        }
        
        // For vehicles, show success message directly since all data is in step2
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
      } else {
        // Standard 3-step process for other categories
        // Validate step 1
        if (!validateStep1()) {
          setStep(1);
          setIsSubmitting(false);
          return;
        }
        
        // Validate step 2 using the provided validation function
        if (validationFunction) {
          const isValid = validationFunction(formData);
          if (!isValid) {
            setStep(2);
            setIsSubmitting(false);
            return;
          }
        }
        
        // Validate step 3
        if (!validateStep3()) {
          setStep(3);
          setIsSubmitting(false);
          return;
        }
        
        // For residential forms, save all data to the database
        if (category === "residential") {
          try {
            // Save step 1 data to the database
            const step1Data = {
              name: formData.name,
              doorNo: formData.doorNo,
              street: formData.street,
              pincode: formData.pincode,
              area: formData.area,
              city: formData.city,
              contactNo: formData.contactNo
            };
            
            let roNo;
            try {
              const { saveResidentialStep1 } = await import("../../screens/residential/logic/api");
              console.log("Saving step 1 data:", step1Data);
              const step1Response = await saveResidentialStep1(step1Data);
              console.log("Step 1 response:", step1Response);
              roNo = step1Response.roNo || step1Response.id; // Handle both possible return values
              
              if (!roNo) {
                throw new Error("Failed to get ID from step 1 response");
              }
            } catch (step1Error) {
              console.error("Step 1 error:", step1Error);
              Alert.alert("Error", "Failed to save step 1 data: " + (step1Error.message || "Unknown error"));
              setIsSubmitting(false);
              return;
            }
            
            // Save step 2 data to the database with correct structure
            try {
              // Prepare bedrooms array
              const bedrooms = [];
              const numBedrooms = parseInt(formData.noOfBedrooms);
              
              if (numBedrooms >= 1) {
                bedrooms.push({
                  number: 1,
                  length: formData.bedroom1Length,
                  breadth: formData.bedroom1Breadth
                });
              }
              
              if (numBedrooms >= 2) {
                bedrooms.push({
                  number: 2,
                  length: formData.bedroom2Length,
                  breadth: formData.bedroom2Breadth
                });
              }
              
              if (numBedrooms >= 3) {
                bedrooms.push({
                  number: 3,
                  length: formData.bedroom3Length,
                  breadth: formData.bedroom3Breadth
                });
              }
              
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
                bedrooms: bedrooms
              };

              console.log("Saving step 2 data:", step2Data);
              try {
                const { saveResidentialStep2 } = await import("../../screens/residential/logic/api");
                await saveResidentialStep2(step2Data);
                console.log("Step 2 saved successfully");
                
                // Save step 3 data to the database
                try {
                  const step3Data = {
                    roNo: roNo,
                    advanceAmount: formData.advanceAmount,
                    monthlyRent: formData.rentAmount
                  };

                  console.log("Saving step 3 data:", step3Data);
                  try {
                    const { saveResidentialStep3 } = await import("../../screens/residential/logic/api");
                    await saveResidentialStep3(step3Data);
                    console.log("Step 3 saved successfully");

                    // Show only one success message for house details saved
                    Alert.alert(
                      "Success",
                      "house details saved", // As per UI Feedback Messaging Strategy memory
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            // Reset form and go back to previous screen instead of navigating forward
                            setFormData(initialFormData);
                            setStep(1);
                            navigation.goBack();
                          }
                        }
                      ]
                    );                  } catch (step3Error) {
                    console.error("Step 3 error:", step3Error);
                    Alert.alert("Error", "Failed to save step 3 data: " + (step3Error.message || "Unknown error"));
                    setIsSubmitting(false);
                    return;
                  }
                } catch (step3Error) {
                  console.error("Step 3 error:", step3Error);
                  Alert.alert("Error", "Failed to save step 3 data: " + (step3Error.message || "Unknown error"));
                  setIsSubmitting(false);
                  return;
                }
              } catch (step2Error) {
                console.error("Step 2 error:", step2Error);
                Alert.alert("Error", "Failed to save step 2 data: " + (step2Error.message || "Unknown error"));
                setIsSubmitting(false);
                return;
              }
            } catch (step2Error) {
              console.error("Step 2 error:", step2Error);
              Alert.alert("Error", "Failed to save step 2 data: " + (step2Error.message || "Unknown error"));
              setIsSubmitting(false);
              return;
            }
          } catch (step1Error) {
            console.error("Step 1 error:", step1Error);
            Alert.alert("Error", "Failed to save step 1 data: " + (step1Error.message || "Unknown error"));
            setIsSubmitting(false);
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
                onPress: () => {
                  // Reset form and go back to previous screen instead of navigating forward
                  setFormData(initialFormData);
                  setStep(1);
                  navigation.goBack();
                }
              }
            ]
          );        }
      }
    } catch (error) {
      console.error("Unexpected error in form submission:", error);
      Alert.alert("Error", "An unexpected error occurred: " + (error.message || "Unknown error"));
      setIsSubmitting(false);
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  // For vehicles category, we only show 2 steps
  const isVehiclesCategory = title === "Add Vehicle";
  const maxSteps = isVehiclesCategory ? 2 : 3;

  return (
    <View style={categoryContentStyles.container}>
      <Header />

      <View style={categoryContentStyles.progressContainer}>
        <Text style={categoryContentStyles.progressText}>Step {step} of {maxSteps}</Text>
      </View>

      <View style={[categoryContentStyles.content, { paddingHorizontal: 20, width: "100%" }]}>
        {step === 1 && (
          <Step1Address formData={formData} handleInputChange={handleStep1Change} />
        )}
        {step === 2 && (
          <Step2Component formData={formData} handleInputChange={handleInputChange} />
        )}
        {!isVehiclesCategory && step === 3 && (
          <Step3PaymentImages
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageSelect={handleImageSelection}
            handleRemoveImage={handleImageRemoval}
          />
        )}

        <View style={categoryContentStyles.buttonRow}>
          {(step > 1 || step === 1) && (
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
              onPress={step > 1 ? handlePrevStep : handleGoBack}
              disabled={isSubmitting}
            >
              <Text style={categoryContentStyles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={step < maxSteps ? handleNextStep : handleFormSubmit}
            disabled={isSubmitting}
          >
            <Text style={categoryContentStyles.buttonText}>
              {isSubmitting ? "Submitting..." : (step < maxSteps ? "Next" : "Submit")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </View>
  );
};

export default BaseForm;