const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const handleFetchRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);
      return result;
    }
    const text = await response.text();
    if (!response.ok) throw new Error(text || `HTTP ${response.status}`);
    return { message: 'Success', data: text };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const getAllProperties = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(k => { if (filters[k]) params.append(k, filters[k]); });
  const qs = params.toString();
  return handleFetchRequest(`${API_BASE_URL}/business/properties${qs ? '?' + qs : ''}`, { method: 'GET' });
};

export const getPropertyDetails = async (id) => {
  return handleFetchRequest(`${API_BASE_URL}/business/properties/${id}`, { method: 'GET' });
};

export default { getAllProperties, getPropertyDetails };
