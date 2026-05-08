# CodeReview AI

AI-powered asynchronous code review platform built with the MERN stack, Monaco Editor, Groq LLMs, GitHub OAuth, SSE streaming, and Socket.io.

### Live Demo
https://codereview-ai-murex.vercel.app

---

## Features

- AI-powered code analysis using Groq (`llama-3.3-70b-versatile`)
- GitHub OAuth authentication
- Monaco Editor integration
- Real-time threaded discussions with Socket.io
- Streaming AI responses using Server-Sent Events (SSE)
- Pull Request review workflows
- File upload and syntax-aware parsing
- Security scanning and best-practice analysis
- PDF export for reports
- Review analytics dashboard
- Protected routes with JWT authentication
- Responsive dark developer UI
- Inline AI-generated fix suggestions
- Severity-based issue detection
- Real-time review progress tracking
- Multi-step AI processing pipeline
- Review grading and scoring system

---

## Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Zustand
- Axios
- Monaco Editor
- Framer Motion
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js
- JWT Authentication
- Groq SDK
- Socket.io
- SSE Streaming
- Helmet
- Express Rate Limit

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

# Core Modules

## Authentication System
- GitHub OAuth 2.0 login flow
- JWT access and refresh tokens
- Secure httpOnly cookie storage
- Protected route handling
- Automatic token refresh using Axios interceptors

---

## AI Review Engine
- AI-generated code reviews
- Security vulnerability scanning
- Bug detection
- Performance analysis
- Readability improvements
- Best-practice recommendations
- AI-generated code fixes
- Severity-based classifications:
  - Error
  - Warning
  - Info
  - Good

---

## Monaco Review Editor
- Read-only Monaco Editor review interface
- Inline severity decorations
- Color-coded gutters
- Multi-file support
- Syntax highlighting
- Line-based review navigation

---

## Real-Time Features
- Socket.io powered discussion threads
- Real-time reply updates
- Live review progress events
- SSE streaming AI responses
- User-specific websocket rooms

---

## Dashboard
- Review analytics
- AI score visualization
- Severity breakdown
- Review history table
- Status tracking
- Language filters
- Animated stat cards

---

## GitHub Integration
- Repository access
- Pull request reviews
- PR diff visualization
- GitHub webhook support
- PR approval workflows

---

# Screens

- Landing Page
- Dashboard
- New Review
- AI Processing
- Review Editor
- PR Review
- Settings Panel

---

# System Architecture

## Frontend
- Component-driven architecture
- Zustand global state management
- Protected route system
- Lazy-loaded Monaco Editor
- SSE hooks for streaming
- Axios interceptor queue handling

## Backend
- REST API architecture
- Modular controller/service pattern
- AI service layer
- WebSocket event architecture
- SSE streaming engine
- JWT middleware authentication

---

# Database Design

## Collections
- Users
- Reviews
- Threads
- Comments

## Database Features
- Indexed review queries
- User-scoped access control
- Embedded AI comments
- Thread-based collaboration structure

---

# Security

- JWT stored in httpOnly cookies
- Helmet enabled
- CORS restricted
- Rate limiting enabled
- SSE cleanup handlers
- Mongo queries scoped per user
- OAuth-secured authentication flow
- Secure GitHub webhook validation

---

# Performance Optimizations

- Lazy-loaded Monaco Editor
- SSE streaming instead of polling
- Optimized Mongoose indexing
- Socket room partitioning
- React Suspense boundaries
- Paginated review queries

---

# Future Improvements

- Multi-file review support
- Team collaboration
- CI/CD integrations
- AI fine-tuning
- GitHub App integration
- Review history analytics
- Organization workspaces
- Codebase-wide analysis
- AI-powered pull request summaries

---

# Author

Nilesh Pratap Dubey

GitHub:
https://github.com/Nilesh-194
