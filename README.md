# UpDrill Backend API

A Node.js + Express + MongoDB backend for the UpDrill interview drills application.

## Features

- **Authentication**: Google OAuth with secure session management
- **Drills Management**: CRUD operations for interview drills with caching
- **Attempt Tracking**: User attempt submission with automatic scoring
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Performance**: MongoDB connection pooling and in-memory caching
- **Logging**: Comprehensive request and error logging with Winston

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth 2.0
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston
- **Caching**: In-memory cache for drills

## Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud instance)
- Google OAuth 2.0 credentials

## Quick Start with Docker

The fastest way to get started is using Docker Compose:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UpDrill
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=4000
   MONGO_URI=mongodb://mongo:27017/upivot
   JWT_SECRET=change_me
   SESSION_COOKIE_NAME=upivot_sid
   NODE_ENV=development
   RATE_LIMIT_WINDOW_MS=300000
   RATE_LIMIT_MAX=100
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=yyy
   GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
   ```

3. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:4000/auth/google/callback`
   - Copy Client ID and Client Secret to your `.env` file

4. **Start all services**
   ```bash
   make up
   # or
   docker-compose up -d
   ```

5. **Seed the database**
   ```bash
   make seed
   # or
   docker-compose exec api npm run seed
   ```

6. **Access the services**
   - API: http://localhost:4000
   - MongoDB Express UI: http://localhost:8081
   - Health Check: http://localhost:4000/api/health

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

## API Endpoints

### Health Check
- `GET /api/health` - Returns `{ok: true}`

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/status` - Check authentication status

### User Management
- `GET /api/me` - Get current user profile (requires auth)

### Drills (Public)
- `GET /api/drills` - Get all drills with filtering and pagination
- `GET /api/drills/:id` - Get specific drill

### Attempts (Requires Auth)
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

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/upivot` |
| `JWT_SECRET` | JWT/Session encryption secret | `change_me` |
| `SESSION_COOKIE_NAME` | Session cookie name | `upivot_sid` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Required |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | `http://localhost:4000/auth/google/callback` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `300000` (5 min) |
| `RATE_LIMIT_MAX` | Rate limit max requests | `100` |
| `CACHE_TTL_MS` | Cache TTL in milliseconds | `60000` (60 sec) |

## Development

### Project Structure
```
api/
├── config/
│   └── passport.js          # Passport configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling
│   ├── logger.js            # Request logging
│   └── validation.js        # Input validation
├── models/
│   ├── User.js              # User model
│   ├── Drill.js             # Drill model
│   └── Attempt.js           # Attempt model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── drills.js            # Drill routes
│   ├── attempts.js          # Attempt routes
│   ├── health.js            # Health check
│   └── user.js              # User routes
├── scripts/
│   └── seed.js              # Database seeding
└── server.js                # Main server file
```

### Adding New Features

1. **New Routes**: Add to appropriate route file in `api/routes/`
2. **New Models**: Create in `api/models/` with proper indexes
3. **New Middleware**: Add to `api/middleware/`
4. **Validation**: Add Zod schemas in `api/middleware/validation.js`

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure session secret
4. Configure CORS for production domains
5. Set up proper logging
6. Use PM2 or similar process manager

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 