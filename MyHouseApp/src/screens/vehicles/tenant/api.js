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

export const getAvailableVehicles = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.rent) queryParams.append('rent', filters.rent);
    if (filters.area) queryParams.append('area', filters.area);

    const url = `${API_BASE_URL}/vehicles/available${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return handleFetchRequest(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
};

export const getVehicleDetails = async (id) => {
    return handleFetchRequest(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
};
