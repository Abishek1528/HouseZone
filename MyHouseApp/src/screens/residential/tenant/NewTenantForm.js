import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { saveNewTenantDetails } from './api';
import { useTheme } from '../../../context/ThemeContext';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import { getOwnerFormThemeColors } from '../../../styles/ownerFormStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import TenantFormCard from '../../../shared/components/TenantFormCard';
import { sanitizePhoneInput } from '../../../shared/utils/phoneInput';

const NewTenantForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const { propertyId, category } = route.params || {};

  const [tenantData, setTenantData] = useState({
    name: '',
    job: '',
    salary: '',
    nativePlace: '',
    currentAddress: '',
    mobileNumber: '',
    alternateNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const prefillFromAccount = async () => {
      try {
        const stored = await AsyncStorage.getItem('userDetails');
        if (!stored) return;
        const user = JSON.parse(stored);
        const accountMobile = user?.contact || user?.contact_number;
        if (!accountMobile) return;
        setTenantData((prev) => ({
          ...prev,
          name: prev.name || user?.name || '',
          mobileNumber: prev.mobileNumber || String(accountMobile).replace(/\D/g, '').slice(-10),
        }));
      } catch (error) {
        console.error('Could not prefill tenant form from account:', error);
      }
    };
    prefillFromAccount();
  }, []);

  const handleInputChange = (field, value) => {
    setTenantData({ ...tenantData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!tenantData.name?.trim() || !tenantData.job?.trim() || !tenantData.salary?.trim() ||
        !tenantData.nativePlace?.trim() || !tenantData.mobileNumber?.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const salaryNum = parseFloat(tenantData.salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid monthly salary');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(tenantData.mobileNumber.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (tenantData.alternateNumber?.trim() && !phoneRegex.test(tenantData.alternateNumber.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit alternate number');
      return;
    }

    if (!propertyId) {
      Alert.alert('Error', 'Property ID is missing. Please try again from the property details page.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveNewTenantDetails({
        roNo: propertyId,
        category: category || 'residential',
        tenant_name: tenantData.name.trim(),
        job: tenantData.job.trim(),
        salary: salaryNum,
        native_place: tenantData.nativePlace.trim(),
        current_address: tenantData.currentAddress.trim(),
        mobile_number: tenantData.mobileNumber.trim(),
        alternate_number: tenantData.alternateNumber?.trim() || null
      });

      Alert.alert('Success', 'Tenant details submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving tenant details:', error);
      Alert.alert('Error', `Failed to save tenant details: ${error.message || 'Network connection failed.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label, key, props = {}) => (
    <View key={key}>
      <Text style={tps.fieldLabel}>{label}</Text>
      <TextInput
        style={[tps.input, props.multiline && { height: 80, textAlignVertical: 'top', paddingVertical: 10 }]}
        placeholderTextColor={themeColors.placeholder}
        value={tenantData[key]}
        onChangeText={(value) => handleInputChange(key, value)}
        editable={!isSubmitting}
        {...props}
      />
    </View>
  );

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="New Tenant Form"
        subtitle="Complete your details to proceed with this listing"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={tps.scrollContent} showsVerticalScrollIndicator={false}>
          <TenantFormCard title="Your Details" subtitle="Fields marked * are required" colors={themeColors} dark={dark}>
            {renderField('Name *', 'name', { placeholder: 'Full Name' })}
            {renderField('Job *', 'job', { placeholder: 'Occupation' })}
            {renderField('Salary per Month *', 'salary', { placeholder: 'Monthly Salary', keyboardType: 'numeric' })}
            {renderField('Native Place *', 'nativePlace', { placeholder: 'Native Place' })}
            {renderField('Current Address', 'currentAddress', { placeholder: 'Current Address', multiline: true, numberOfLines: 3 })}
            {renderField('Mobile Number *', 'mobileNumber', {
              placeholder: 'Mobile Number',
              keyboardType: 'phone-pad',
              maxLength: 10,
              onChangeText: (value) => handleInputChange('mobileNumber', sanitizePhoneInput(value)),
            })}
            {renderField('Alternate Number', 'alternateNumber', {
              placeholder: 'Alternate Number',
              keyboardType: 'phone-pad',
              maxLength: 10,
              onChangeText: (value) => handleInputChange('alternateNumber', sanitizePhoneInput(value)),
            })}
          </TenantFormCard>
        </ScrollView>

        <View style={[tps.bottomBar, { paddingHorizontal: 16, paddingBottom: 12 }]}>
          <TouchableOpacity style={tps.btnOutline} onPress={() => navigation.goBack()} disabled={isSubmitting}>
            <Text style={tps.btnOutlineText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[tps.btnPrimary, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={tps.btnText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  );
};

export default NewTenantForm;
