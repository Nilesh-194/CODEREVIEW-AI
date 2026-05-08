import { create } from 'zustand'

export const useReviewStore = create((set) => ({
  reviews: [],
  currentReview: null,
  stats: null,
  setReviews: (reviews) => set({ reviews }),
  setCurrentReview: (review) => set({ currentReview: review }),
  setStats: (stats) => set({ stats }),
  addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
  updateReview: (id, updates) => set((state) => ({
    reviews: state.reviews.map((review) => (review._id === id ? { ...review, ...updates } : review)),
    currentReview: state.currentReview?._id === id ? { ...state.currentReview, ...updates } : state.currentReview,
  })),
}))
