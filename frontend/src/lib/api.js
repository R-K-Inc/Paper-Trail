import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

// The redirect logic was causing an infinite loop.
// The AuthContext and Router already handle unauthorized access correctly.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We just pass the error along.
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
  login: (credentials) => api.post('/api/login', credentials),
  register: (userData) => api.post('/api/register', userData),
  logout: () => api.post('/api/logout'),
  me: () => api.get('/api/me')
}