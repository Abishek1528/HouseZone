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

// Get all residential properties for tenant view
export const getAllProperties = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error(`Failed to fetch properties: ${error.message || 'Network error'}`);
  }
};

// Get detailed residential property information
export const getPropertyDetails = async (id) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/properties/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw new Error(`Failed to fetch property details: ${error.message || 'Network error'}`);
  }
};

// Save tenant details to the database
export const saveTenantDetails = async (tenantData) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/tenant-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });
    
    return result;
  } catch (error) {
    console.error('Error saving tenant details:', error);
    throw new Error(`Failed to save tenant details: ${error.message || 'Network error'}`);
  }
};