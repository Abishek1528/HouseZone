// API functions for admin data
// Use localhost as default, but allow override via environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper function to handle fetch requests
const handleFetchRequest = async (url, options) => {
  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { message: text };
    }
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Get all residential owners for admin view
export const getAllResidentialOwners = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/owners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching residential owners:', error);
    throw new Error(`Failed to fetch residential owners: ${error.message || 'Network error'}`);
  }
};

// Get all business owners for admin view
export const getAllBusinessOwners = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/business/owners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching business owners:', error);
    throw new Error(`Failed to fetch business owners: ${error.message || 'Network error'}`);
  }
};

// Get all vehicles with owners for admin view
export const getAllVehiclesOwners = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/vehicles/owners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching vehicles owners:', error);
    throw new Error(`Failed to fetch vehicles owners: ${error.message || 'Network error'}`);
  }
};

// Get all machinery with owners for admin view
export const getAllMachineryOwners = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/machinery/owners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching machinery owners:', error);
    throw new Error(`Failed to fetch machinery owners: ${error.message || 'Network error'}`);
  }
};

// Get all residential tenants with their associated properties
export const getResidentialTenantsWithProperties = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/admin/residential/tenants-with-properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching tenants with properties:', error);
    throw new Error(`Failed to fetch tenants with properties: ${error.message || 'Network error'}`);
  }
};

// Get all business tenants with their associated properties
export const getBusinessTenantsWithProperties = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/admin/business/tenants-with-properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching business tenants:', error);
    throw new Error(`Failed to fetch business tenants: ${error.message || 'Network error'}`);
  }
};

// Get all machinery tenants with their associated items
export const getMachineryTenantsWithItems = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/admin/machinery/tenants-with-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching machinery tenants:', error);
    throw new Error(`Failed to fetch machinery tenants: ${error.message || 'Network error'}`);
  }
};

// Get all vehicle tenants with their associated items
export const getVehicleTenantsWithItems = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/admin/vehicles/tenants-with-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching vehicle tenants:', error);
    throw new Error(`Failed to fetch vehicle tenants: ${error.message || 'Network error'}`);
  }
};

// Get all job givers for admin view
export const getAllJobGivers = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/admin/jobgiver/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching job givers:', error);
    throw new Error(`Failed to fetch job givers: ${error.message || 'Network error'}`);
  }
};

// Get all job seekers for admin view
export const getAllJobSeekersAdmin = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/admin/jobseeker/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    throw new Error(`Failed to fetch job seekers: ${error.message || 'Network error'}`);
  }
};

// Job Options: Titles
export const getJobTitles = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/job-options/titles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching job titles:', error);
    throw new Error(`Failed to fetch job titles: ${error.message || 'Network error'}`);
  }
};

export const addJobTitle = async (title) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/job-options/titles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    return result;
  } catch (error) {
    console.error('Error adding job title:', error);
    throw error;
  }
};

export const deleteJobTitle = async (id) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/job-options/titles/${id}`, {
      method: 'DELETE',
    });
    return result;
  } catch (error) {
    console.error('Error deleting job title:', error);
    throw error;
  }
};

// Job Options: Areas
export const getJobAreas = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/job-options/areas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching job areas:', error);
    throw new Error(`Failed to fetch job areas: ${error.message || 'Network error'}`);
  }
};

export const addJobArea = async (name) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/job-options/areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return result;
  } catch (error) {
    console.error('Error adding job area:', error);
    throw error;
  }
};

export const deleteJobArea = async (id) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/job-options/areas/${id}`, {
      method: 'DELETE',
    });
    return result;
  } catch (error) {
    console.error('Error deleting job area:', error);
    throw error;
  }
};

