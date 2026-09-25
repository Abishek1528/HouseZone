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

export const saveJobGiverStep3 = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const form = new FormData();
      form.append('jobGiverId', String(data.jobGiverId));
      form.append('salaryOffering', String(data.salaryOffering || ''));
      if (data.otherSkills) {
        form.append('otherSkills', String(data.otherSkills));
      }
      if (data.shopPhoto1) {
        form.append('shopPhoto1', {
          uri: data.shopPhoto1,
          name: 'shop_photo_1.jpg',
          type: 'image/jpeg',
        });
      }
      if (data.shopPhoto2) {
        form.append('shopPhoto2', {
          uri: data.shopPhoto2,
          name: 'shop_photo_2.jpg',
          type: 'image/jpeg',
        });
      }
      if (data.shopPhoto3) {
        form.append('shopPhoto3', {
          uri: data.shopPhoto3,
          name: 'shop_photo_3.jpg',
          type: 'image/jpeg',
        });
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/jobgiver/step3`);
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.onload = () => {
        try {
          const result = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(result);
          } else {
            reject(new Error(result?.message || `HTTP ${xhr.status}`));
          }
        } catch (_) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ message: 'Success' });
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error uploading shop photo'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Request timed out uploading shop photo'));
      };

      xhr.timeout = 30000;
      xhr.send(form);
    } catch (error) {
      console.error('Error saving job giver step 3:', error);
      reject(new Error(`Failed to save step 3: ${error.message || 'Unknown error'}`));
    }
  });
};

export const getJobSeekers = async (jobGiverId = null) => {
  const url = jobGiverId
    ? `${API_BASE_URL}/jobgiver/jobseekers?jobGiverId=${encodeURIComponent(jobGiverId)}`
    : `${API_BASE_URL}/jobgiver/jobseekers`;
  return handleFetchRequest(url);
};

export const getJobSeekerDetails = async (jobSeekerId) => {
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/jobseekers/${jobSeekerId}`);
};

export const acceptJobSeeker = async (jobSeekerId) => {
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/jobseekers/${jobSeekerId}/accept`, {
    method: 'PUT',
  });
};

export const declineJobSeeker = async (jobSeekerId) => {
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/jobseekers/${jobSeekerId}/decline`, {
    method: 'PUT',
  });
};

export default {
  saveJobGiverStep1,
  saveJobGiverStep2,
  saveJobGiverStep3,
  getJobSeekers,
  getJobSeekerDetails,
  acceptJobSeeker,
  declineJobSeeker
};