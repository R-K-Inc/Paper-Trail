import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const notesApi = {
  getNotes: (params = {}) => api.get('/api/notes', { params }),
  getNote: (id) => api.get(`/api/notes/${id}`),
  createNote: (note) => api.post('/api/notes', note),
  updateNote: (id, note) => api.put(`/api/notes/${id}`, note),
  deleteNote: (id) => api.delete(`/api/notes/${id}`),
  searchNotes: (query) => api.get('/api/notes/search', { params: { q: query } })
}

export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: () => api.post('/api/auth/refresh')
}