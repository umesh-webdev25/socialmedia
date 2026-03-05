import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error responses — always throw { message, errors }
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message = data?.message || error.message || 'Something went wrong';
    const errors = data?.errors || null;
    return Promise.reject({ message, errors, status: error.response?.status });
  }
);

export default apiClient;

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login:    (data) => apiClient.post('/auth/login', data),
  getMe:    ()     => apiClient.get('/auth/me'),
};

// ─── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:    ()     => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.patch('/users/profile', data),
};

// ─── Posts ─────────────────────────────────────────────────────────────────────
export const postAPI = {
  getAll:  ()     => apiClient.get('/posts'),
  getMy:   ()     => apiClient.get('/posts/my'),
  create:  (data) => apiClient.post('/posts', data),
  remove:  (id)   => apiClient.delete(`/posts/${id}`),
};
