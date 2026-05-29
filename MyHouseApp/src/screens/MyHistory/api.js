const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getMyBookingHistory = async ({ contact, userId }) => {
  const normalizedContact = String(contact || '').replace(/\D/g, '').slice(-10);
  if (!normalizedContact || normalizedContact.length !== 10) {
    throw new Error('Please log in with a valid account contact number.');
  }

  const params = new URLSearchParams({ contact: normalizedContact });
  if (userId) {
    params.append('userId', String(userId));
  }

  const url = `${API_BASE_URL}/my-history?${params.toString()}`;
  console.log('Fetching my history:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const contentType = response.headers.get('content-type') || '';
  let result;
  if (contentType.includes('application/json')) {
    result = await response.json();
  } else {
    const text = await response.text();
    result = { message: text };
  }

  if (!response.ok) {
    throw new Error(result?.message || `Failed to load history (${response.status})`);
  }

  return result;
};
