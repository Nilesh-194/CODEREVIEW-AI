import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()))
  failedQueue = []
}

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (original?.skipAuthRefresh) return Promise.reject(error)
    if (error.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject })).then(() => instance(original))
      }
      original._retry = true
      isRefreshing = true
      try {
        await instance.post('/auth/refresh')
        processQueue(null)
        return instance(original)
      } catch (err) {
        processQueue(err)
        if (window.location.pathname !== '/landing') window.location.href = '/landing'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default instance
