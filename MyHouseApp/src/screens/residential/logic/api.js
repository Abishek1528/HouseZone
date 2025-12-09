// API functions for residential data
const API_BASE_URL = 'http://10.86.202.103:3000/api'; // Change this to your backend IP address

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

    const response = await fetch(`${API_BASE_URL}/residential/save-step1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to save residential step 1 details');
    }
    
    return result;
  } catch (error) {
    console.error('Error saving residential step 1 details:', error);
    throw error;
  }
};

// Get residential step 1 details by ID
export const getResidentialStep1 = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/residential/step1/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch residential step 1 details');
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching residential step 1 details:', error);
    throw error;
  }
};