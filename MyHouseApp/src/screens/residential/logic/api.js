// API functions for residential data
// Use localhost as default, but allow override via environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper function to handle fetch requests
const handleFetchRequest = async (url, options) => {
  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return result;
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${text}`);
      }
      return { message: 'Success', data: text };
    }
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Save residential step 1 details
export const saveResidentialStep1 = async (step1Data) => {
  try {
    // Extract only the fields that exist in the database table
    const { name, doorNo, street, pincode, area, city, contactNo } = step1Data;
    
    const dataToSend = {
      name,
      doorNo,
      street,
      pincode,
      area,
      city,
      contactNo
    };

    const result = await handleFetchRequest(`${API_BASE_URL}/residential/step1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    
    return result;
  } catch (error) {
    console.error('Error saving step 1 details:', error);
    throw new Error(`Failed to save step 1 details: ${error.message || 'Network error'}`);
  }
};

// Save residential step 2 details
export const saveResidentialStep2 = async (step2Data) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/step2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step2Data),
    });
    
    return result;
  } catch (error) {
    console.error('Error saving step 2 details:', error);
    throw new Error(`Failed to save step 2 details: ${error.message || 'Network error'}`);
  }
};

// Save residential step 3 details
export const saveResidentialStep3 = async (step3Data) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/step3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step3Data),
    });
    
    return result;
  } catch (error) {
    console.error('Error saving step 3 details:', error);
    throw new Error(`Failed to save step 3 details: ${error.message || 'Network error'}`);
  }
};

// Get residential step 1 details by ID
export const getResidentialStep1 = async (id) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/step1/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching step 1 details:', error);
    throw new Error(`Failed to fetch step 1 details: ${error.message || 'Network error'}`);
  }
};