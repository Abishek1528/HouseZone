// API functions for admin data
// Use localhost as default, but allow override via environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper function to handle fetch requests
const handleFetchRequest = async (url, options) => {
  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Get all residential owners for admin view
export const getAllResidentialOwners = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/owners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching residential owners:', error);
    throw new Error(`Failed to fetch residential owners: ${error.message || 'Network error'}`);
  }
};