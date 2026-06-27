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

export const saveJobGiverStep1 = async (data) => {
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/step1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const saveJobGiverStep2 = async (data) => {
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/step2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const saveJobGiverStep3 = async (data) => {
  try {
    const form = new FormData();
    form.append('jobGiverId', String(data.jobGiverId));
    form.append('salaryOffering', data.salaryOffering);
    if (data.otherSkills) {
      form.append('otherSkills', data.otherSkills);
    }
    if (data.shopPhoto1) {
      const name = 'shop_photo_1.jpg';
      const type = 'image/jpeg';
      form.append('shopPhoto1', { uri: data.shopPhoto1, name, type });
    }
    if (data.shopPhoto2) {
      const name = 'shop_photo_2.jpg';
      const type = 'image/jpeg';
      form.append('shopPhoto2', { uri: data.shopPhoto2, name, type });
    }
    if (data.shopPhoto3) {
      const name = 'shop_photo_3.jpg';
      const type = 'image/jpeg';
      form.append('shopPhoto3', { uri: data.shopPhoto3, name, type });
    }
    const response = await fetch(`${API_BASE_URL}/jobgiver/step3`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
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
    console.error('Error saving job giver step 3:', error);
    throw new Error(`Failed to save step 3: ${error.message || 'Network error'}`);
  }
};

export default {
  saveJobGiverStep1,
  saveJobGiverStep2,
  saveJobGiverStep3
};