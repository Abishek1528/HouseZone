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

export const saveVehiclesStep1 = async (data) => {
  console.log('Sending vehicles step1 data:', data);
  return handleFetchRequest(`${API_BASE_URL}/vehicles/step1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const saveVehiclesStep2 = async (data) => {
  console.log('Sending vehicles step2 data:', data);
  return handleFetchRequest(`${API_BASE_URL}/vehicles/step2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const uploadVehiclesImages = async (voNo, imageUris = []) => {
  try {
    const form = new FormData();
    form.append('voNo', String(voNo));
    imageUris.forEach((uri, idx) => {
      const name = `vehicle_${idx + 1}.jpg`;
      const type = 'image/jpeg';
      form.append('images', { uri, name, type });
    });
    const response = await fetch(`${API_BASE_URL}/vehicles/images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: form
    });
    const contentType = response.headers.get('content-type') || '';
    let result;
    if (contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { message: 'Success', data: text };
    }
    if (!response.ok) {
      throw new Error(result?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return result;
  } catch (error) {
    console.error('Error uploading vehicle images:', error);
    throw new Error(`Failed to upload images: ${error.message || 'Network error'}`);
  }
};

export default {
  saveVehiclesStep1,
  saveVehiclesStep2,
  uploadVehiclesImages
};
