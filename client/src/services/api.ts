import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const disasterApi = {
  getAll: (params?: Record<string, string>) => api.get('/disasters', { params }),
  getById: (id: string) => api.get(`/disasters/${id}`),
  create: (data: any) => api.post('/disasters', data),
  update: (id: string, data: any) => api.put(`/disasters/${id}`, data),
  delete: (id: string) => api.delete(`/disasters/${id}`),
};

export const shelterApi = {
  getAll: () => api.get('/shelters'),
  getNearby: (lat: number, lng: number, radius?: number, type?: string) =>
    api.get('/shelters/nearby', { params: { lat, lng, radius, type } }),
  create: (data: any) => api.post('/shelters', data),
  updateCapacity: (id: string, currentOccupancy: number) =>
    api.put(`/shelters/${id}/capacity`, { currentOccupancy }),
};

export const volunteerApi = {
  register: (data: { skills?: string[]; phone?: string; location?: any }) =>
    api.post('/volunteers/register', data),
  getTasks: (id: string, status?: string) =>
    api.get(`/volunteers/${id}/tasks`, { params: { status } }),
};

export const taskApi = {
  getAll: (params?: Record<string, string>) => api.get('/tasks', { params }),
  create: (data: any) => api.post('/tasks', data),
  updateStatus: (id: string, status: string) => api.put(`/tasks/${id}/status`, { status }),
  addProgress: (id: string, message: string) => api.post(`/tasks/${id}/updates`, { message }),
};

export const resourceApi = {
  getAll: (params?: Record<string, string>) => api.get('/resources', { params }),
  getByDisaster: (id: string) => api.get(`/resources/disasters/${id}`),
  create: (data: any) => api.post('/resources', data),
  allocate: (id: string, data: { quantity: number; allocatedTo?: string; disaster?: string }) =>
    api.put(`/resources/${id}/allocate`, data),
  updateStatus: (id: string, status: string) => api.put(`/resources/${id}/status`, { status }),
};

export const alertApi = {
  getAll: () => api.get('/alerts'),
  getById: (id: string) => api.get(`/alerts/${id}`),
  create: (data: any) => api.post('/alerts', data),
  markRead: (id: string) => api.put(`/alerts/${id}/read`),
};

export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard'),
};

export default api;
