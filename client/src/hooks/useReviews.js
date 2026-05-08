import { useCallback, useEffect, useState } from 'react'
import axios from '../lib/axios'
import { useReviewStore } from '../store/reviewStore'

export const useReviews = () => {
  const { reviews, setReviews } = useReviewStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get('/api/reviews')
      setReviews(data.reviews)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [setReviews])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, isLoading, error, fetchReviews }
}
