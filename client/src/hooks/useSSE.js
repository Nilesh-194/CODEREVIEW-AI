import { useEffect, useRef, useState } from 'react'

export const useSSE = (url, handlers = {}, enabled = true) => {
  const [error, setError] = useState(null)
  const sourceRef = useRef(null)
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    if (!enabled || !url) return undefined
    const source = new EventSource(url, { withCredentials: true })
    sourceRef.current = source
    source.onmessage = (event) => {
      const payload = JSON.parse(event.data)
      handlersRef.current[payload.type]?.(payload)
      handlersRef.current.message?.(payload)
    }
    source.onerror = () => {
      setError('SSE connection closed')
      source.close()
    }
    return () => source.close()
  }, [url, enabled])

  return { error, close: () => sourceRef.current?.close() }
}
