const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const handleFetchRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);
      return result;
    } else {
      const text = await response.text();
      if (!response.ok) throw new Error(text || `HTTP ${response.status}`);
      return { message: 'Success', data: text };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const saveBusinessStep1 = async (data) => {
  return handleFetchRequest(`${API_BASE_URL}/business/step1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const saveBusinessStep2 = async (data) => {
  return handleFetchRequest(`${API_BASE_URL}/business/step2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const saveBusinessStep3 = async (data) => {
  return handleFetchRequest(`${API_BASE_URL}/business/step3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export default {
  saveBusinessStep1,
  saveBusinessStep2,
  saveBusinessStep3
};
