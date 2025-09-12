import axios from 'axios'

export const useApi = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  })

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}