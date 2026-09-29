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
  // IMAGE UPLOAD DISABLED: Now sending JSON instead of multipart form data
  // Photos (shopPhoto1, shopPhoto2, shopPhoto3) are not sent to avoid errors.
  // To re-enable, restore FormData + XHR approach and uncomment upload.fields() in backend.
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/step3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobGiverId: data.jobGiverId,
      salaryOffering: data.salaryOffering || '',
      otherSkills: data.otherSkills || '',
      // shopPhoto1: data.shopPhoto1,  // DISABLED
      // shopPhoto2: data.shopPhoto2,  // DISABLED
      // shopPhoto3: data.shopPhoto3,  // DISABLED
    }),
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