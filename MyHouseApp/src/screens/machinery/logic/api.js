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

export const saveMachineryStep1 = async (data) => {
  console.log('Sending machinery step1 data:', data);
  return handleFetchRequest(`${API_BASE_URL}/machinery/step1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const saveMachineryStep2 = async (data) => {
  console.log('Sending machinery step2 data:', data);
  const result = await handleFetchRequest(`${API_BASE_URL}/machinery/step2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  console.log('Machinery step2 response:', result);
  return result;
};

export default {
  saveMachineryStep1,
  saveMachineryStep2
};