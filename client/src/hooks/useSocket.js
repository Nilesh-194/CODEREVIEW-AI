import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../store/authStore'
import { useSocketStore } from '../store/socketStore'

export const useSocket = () => {
  const { user } = useAuthStore()
  const { socket, setSocket } = useSocketStore()

  useEffect(() => {
    if (!user) return undefined
    const nextSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { userId: user._id },
      withCredentials: true,
    })
    setSocket(nextSocket)
    return () => {
      nextSocket.disconnect()
      setSocket(null)
    }
  }, [user, setSocket])

  return socket
}
