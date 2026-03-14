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

export const getMachineryProperties = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.rent) queryParams.append('rent', filters.rent);
  if (filters.area) queryParams.append('area', filters.area);

  const url = `${API_BASE_URL}/machinery/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleFetchRequest(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
};

export const getMachineryDetails = async (id) => {
  return handleFetchRequest(`${API_BASE_URL}/machinery/properties/${id}`, { method: 'GET' });
};
