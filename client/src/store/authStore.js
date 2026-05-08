import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '../lib/axios'

export const useAuthStore = create(persist((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  logout: async () => {
    await axios.post('/auth/logout')
    set({ user: null })
    window.location.href = '/landing'
  },
  fetchMe: async () => {
    try {
      const { data } = await axios.get('/api/users/me', { skipAuthRefresh: true })
      set({ user: data, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },
}), { name: 'auth-store', partialize: (state) => ({ user: state.user }) }))
