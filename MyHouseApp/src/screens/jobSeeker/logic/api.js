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

export const getJobListings = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.jobTitle) queryParams.append('jobTitle', filters.jobTitle);
  if (filters.area) queryParams.append('area', filters.area);
  if (filters.minSalary) queryParams.append('minSalary', filters.minSalary);
  if (filters.maxSalary) queryParams.append('maxSalary', filters.maxSalary);
  const url = `${API_BASE_URL}/jobseeker/jobs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return handleFetchRequest(url);
};

export const getJobDetails = async (jobId) => {
  return handleFetchRequest(`${API_BASE_URL}/jobseeker/jobs/${jobId}`);
};

export const getJobSeekerById = async (jobSeekerId) => {
  // Use the same endpoint as job giver since it returns all details
  return handleFetchRequest(`${API_BASE_URL}/jobgiver/jobseekers/${jobSeekerId}`);
};

export const getJobSeekerApplications = async (mobileNumber) => {
  return handleFetchRequest(`${API_BASE_URL}/jobseeker/applications/${mobileNumber}`);
};

export const saveJobSeeker = async (data) => {
  return handleFetchRequest(`${API_BASE_URL}/jobseeker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export default {
  getJobListings,
  getJobDetails,
  getJobSeekerById,
  getJobSeekerApplications,
  saveJobSeeker
};