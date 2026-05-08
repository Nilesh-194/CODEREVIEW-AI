import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div className="empty-state">Something failed to render. Refresh and try again.</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
