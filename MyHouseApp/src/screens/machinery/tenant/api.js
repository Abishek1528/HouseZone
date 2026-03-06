const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const handleFetchRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

export const getMachineryProperties = async () => {
  return handleFetchRequest(`${API_BASE_URL}/machinery/properties`, { method: 'GET' });
};

export const getMachineryDetails = async (id) => {
  return handleFetchRequest(`${API_BASE_URL}/machinery/properties/${id}`, { method: 'GET' });
};
