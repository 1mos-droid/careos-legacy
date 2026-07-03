const API_URL = '/api';

async function request(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('careos_token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    // Handle session expiration
    if (response.status === 401 && token) {
      localStorage.removeItem('careos_token');
      window.location.href = '/auth?tab=login';
    }

    return Promise.reject(data.error || 'Something went wrong');
  } catch (err) {
    return Promise.reject(err.message || 'Network error');
  }
}

export const api = {
  get: (endpoint, config) => request(endpoint, { ...config, method: 'GET' }),
  post: (endpoint, body, config) => request(endpoint, { ...config, body, method: 'POST' }),
  put: (endpoint, body, config) => request(endpoint, { ...config, body, method: 'PUT' }),
  patch: (endpoint, body, config) => request(endpoint, { ...config, body, method: 'PATCH' }),
  delete: (endpoint, config) => request(endpoint, { ...config, method: 'DELETE' }),
};
