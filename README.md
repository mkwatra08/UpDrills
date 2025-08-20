# UpDrill - Interview Drills Application

A complete full-stack interview drills application built with Node.js, Express, MongoDB, and React.

## 🚀 Live Demo

Video Link: [https://youtu.be/nGVqaVLal-A](https://youtu.be/nGVqaVLal-A)

## 📋 Overview

UpDrill is a comprehensive interview preparation platform that allows users to:
- **Practice Drills**: Take interview drills with various difficulty levels
- **Track Progress**: View attempt history and performance analytics
- **Secure Authentication**: Sign in with Google OAuth
- **Real-time Scoring**: Get immediate feedback on your answers

## 🏗️ Architecture

**Backend**: Node.js + Express + MongoDB
**Frontend**: React + Vite + Tailwind CSS
**Authentication**: Google OAuth 2.0
**Testing**: Jest + Supertest + k6 Performance Testing

## Features

### Backend Features
- **Authentication**: Google OAuth with secure session management
- **Drills Management**: CRUD operations for interview drills with caching
- **Attempt Tracking**: User attempt submission with automatic scoring
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Performance**: MongoDB connection pooling and in-memory caching
- **Logging**: Comprehensive request and error logging with Winston

### Frontend Features
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **User Dashboard**: View available drills and start practice sessions
- **Drill Interface**: Interactive question answering with real-time feedback
- **Progress Tracking**: View attempt history and performance statistics
- **Authentication Flow**: Seamless Google OAuth integration
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth 2.0
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston
- **Caching**: In-memory cache for drills

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Development**: Hot module replacement

### Testing & Tools
- **Backend Testing**: Jest + Supertest
- **Performance Testing**: k6
- **API Testing**: Postman Collection
- **Containerization**: Docker + Docker Compose

## Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud instance)
- Google OAuth 2.0 credentials

## Quick Start

### Complete Setup (Backend + Frontend)

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd UpDrill
   cp .env.example .env
   ```

2. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

3. **Set up Google OAuth** (see [OAuth Setup](#oauth-setup) section)

4. **Install dependencies**
   ```bash
   # Backend dependencies
   npm install
   
   # Frontend dependencies
   cd web
   npm install
   cd ..
   ```

5. **Start the backend**
   ```bash
   # Option 1: Docker (recommended)
   make up
   make seed
   
   # Option 2: Manual
   npm run dev
   npm run seed
   ```

6. **Start the frontend**
   ```bash
   cd web
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/api/health

### Manual Setup

If you prefer to run without Docker:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

3. **Configure environment variables**

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

## OAuth Setup

### Google OAuth Configuration

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API

2. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:4000/auth/google/callback` (for development)
     - `https://yourdomain.com/auth/google/callback` (for production)

3. **Configure Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
   ```

4. **Test OAuth Flow**
   ```bash
   curl http://localhost:4000/auth/config
   # Should return: {"oauthConfigured":true,"message":"OAuth is properly configured"}
   ```

## Manual Installation

If you prefer to run without Docker:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## Docker Commands

Use the provided Makefile for common operations:

```bash
# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Build images
make build

# Seed database
make seed

# Clean up everything
make clean

# Show service status
make status

# Access API container shell
make shell

# Access MongoDB shell
make mongo
```

### Docker Services

- **API**: Node.js application on port 4000
- **MongoDB**: Database on port 27017 with persisted volume
- **Mongo Express**: Web UI for MongoDB on port 8081

## Application Features

### Frontend Application

The React frontend provides a complete user interface:

- **Landing Page**: Welcome screen with Google OAuth sign-in
- **Dashboard**: Browse available drills by difficulty and tags
- **Drill Interface**: Interactive question answering with real-time feedback
- **History**: View past attempts with scores and timestamps
- **Responsive Design**: Works seamlessly on desktop and mobile

### Backend API

#### Health Check
- `GET /api/health` - Returns `{ok: true}`

#### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/status` - Check authentication status

#### User Management
- `GET /api/me` - Get current user profile (requires auth)

#### Drills (Public)
- `GET /api/drills` - Get all drills with filtering and pagination
- `GET /api/drills/:id` - Get specific drill

#### Attempts (Requires Auth)
- `POST /api/attempts` - Submit attempt with scoring
- `GET /api/attempts` - Get user attempts (limit=5 by default)
- `GET /api/attempts/:id` - Get specific attempt
- `GET /api/attempts/stats` - Get user statistics

## Data Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  picture: String,
  providers: [{
    provider: String,
    providerId: String
  }],
  createdAt: Date
}
```

### Drill
```javascript
{
  _id: ObjectId,
  title: String,
  difficulty: String (easy|medium|hard),
  tags: [String],
  questions: [{
    id: String,
    prompt: String,
    keywords: [String]
  }]
}
```

### Attempt
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  drillId: ObjectId (ref: Drill),
  answers: [{
    qid: String,
    text: String
  }],
  score: Number (0-100),
  createdAt: Date
}
```

## Database Indexes

- `users.email` (unique)
- `attempts.userId + createdAt`
- `drills.tags`
- `drills.difficulty`

## Security Features

- **Helmet**: Security headers
- **CORS**: Strict origin policy
- **Rate Limiting**: 100 requests per 5 minutes per IP
- **Input Validation**: Zod schema validation
- **Session Security**: HttpOnly, secure cookies
- **Request Logging**: Comprehensive logging with Winston

## Performance Features

- **MongoDB Connection Pooling**: Optimized database connections
- **In-Memory Caching**: 60-second cache for `/api/drills`
- **Compression**: Response compression
- **Indexing**: Optimized database indexes

## Error Handling

Consistent error response format:
```javascript
{
  error: {
    code: "ERROR_CODE",
    message: "Human readable message"
  }
}
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample drills
- `npm test` - Run tests

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxxxxxxxxxxxxxxxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/upivot` |
| `JWT_SECRET` | JWT/Session encryption secret | `change_me` |
| `SESSION_COOKIE_NAME` | Session cookie name | `upivot_sid` |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | `http://localhost:4000/auth/google/callback` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `300000` (5 min) |
| `RATE_LIMIT_MAX` | Rate limit max requests | `100` |
| `CACHE_TTL_MS` | Cache TTL in milliseconds | `60000` (60 sec) |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173` |
| `FRONTEND_URL` | Frontend URL for OAuth redirect | `http://localhost:5173` |
| `LOG_LEVEL` | Winston log level | `info` |

### Example .env file

```env
# Required OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://mongo:27017/upivot

# Security
JWT_SECRET=your-super-secret-jwt-key
SESSION_COOKIE_NAME=upivot_sid

# OAuth Callback
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# CORS
ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=300000
RATE_LIMIT_MAX=100

# Caching
CACHE_TTL_MS=60000

# Logging
LOG_LEVEL=info
```

## Development

### Project Structure
```
UpDrill/
├── api/                     # Backend API
│   ├── config/
│   │   └── passport.js      # Passport configuration
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js  # Error handling
│   │   ├── logger.js        # Request logging
│   │   └── validation.js    # Input validation
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Drill.js         # Drill model
│   │   └── Attempt.js       # Attempt model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── drills.js        # Drill routes
│   │   ├── attempts.js      # Attempt routes
│   │   ├── health.js        # Health check
│   │   └── user.js          # User routes
│   ├── scripts/
│   │   └── seed.js          # Database seeding
│   └── server.js            # Main server file
├── web/                     # Frontend React App
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── components/      # React components
│   │   └── styles/          # CSS styles
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── docker-compose.yml       # Docker services
├── package.json             # Backend dependencies
└── README.md               # Project documentation
```

### Adding New Features

1. **New Routes**: Add to appropriate route file in `api/routes/`
2. **New Models**: Create in `api/models/` with proper indexes
3. **New Middleware**: Add to `api/middleware/`
4. **Validation**: Add Zod schemas in `api/middleware/validation.js`

## Testing

### Test Commands

```bash
# Run all backend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run performance tests (requires k6)
./run-performance-test.sh

# Run specific test file
npm test -- api/k6/health.test.js
```

### Backend Tests

**Test Coverage:**
- ✅ Health check endpoint
- ✅ Authentication flow (OAuth config, user status, logout)
- ✅ Drills caching and filtering
- ✅ Error handling and validation

**Test Structure:**
```
api/k6/
├── health.test.js         # Health check tests
├── auth.test.js           # Authentication tests
└── drills-cache.test.js   # Drills caching performance tests
```

### Performance Testing

**Requirements:**
- Install k6: `brew install k6` (macOS) or follow [k6 installation guide](https://k6.io/docs/getting-started/installation/)
- Backend must be running (`npm run dev`)

**Performance Criteria:**
- 95% of requests must complete below 150ms
- Less than 1% of requests can fail

### API Testing

Import the Postman collection: `UpDrill-API.postman_collection.json`

**Manual Testing:**
- Health check endpoint
- Authentication flow (OAuth config, Google OAuth)
- Drills CRUD operations
- Attempts submission and retrieval
- Error handling and validation
- Rate limiting and security

## Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure session secret
4. Configure CORS for production domains
5. Set up proper logging
6. Use PM2 or similar process manager

## Known Limitations & Next Steps

### Current Limitations

1. **Authentication**
   - Only Google OAuth is supported (no email/password)
   - No password reset functionality
   - No account deletion

2. **Drills Management**
   - No admin interface for creating/editing drills
   - Limited drill types (only text-based questions)
   - No image or file upload support

3. **Scoring System**
   - Basic keyword matching for scoring
   - No advanced NLP or AI-powered evaluation
   - No partial credit system

4. **Performance**
   - In-memory caching (not Redis)
   - No database query optimization for large datasets
   - No CDN for static assets

5. **Security**
   - No rate limiting per user (only per IP)
   - No audit logging for sensitive operations
   - No input sanitization for rich text

### What You'd Do Next

1. **Enhanced Authentication**
   - Add email/password authentication
   - Implement password reset flow
   - Add multi-factor authentication
   - User profile management

2. **Advanced Drills**
   - Admin dashboard for drill management
   - Support for multiple question types (MCQ, coding, etc.)
   - File upload for images/documents
   - Drill templates and categories

3. **Improved Scoring**
   - AI-powered answer evaluation
   - Partial credit system
   - Detailed feedback for answers
   - Performance analytics

4. **Performance & Scalability**
   - Redis for caching and sessions
   - Database query optimization
   - CDN integration
   - Load balancing

5. **Security Enhancements**
   - Per-user rate limiting
   - Audit logging
   - Input sanitization
   - Security headers optimization

6. **Monitoring & Analytics**
   - Application performance monitoring
   - User behavior analytics
   - Error tracking and alerting
   - Usage statistics

7. **Frontend Improvements**
   - Progressive Web App (PWA)
   - Offline support
   - Real-time notifications
   - Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 