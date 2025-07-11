# Architecture Overview

This document provides a comprehensive overview of the ConflictCalendar application architecture.

## System Architecture

ConflictCalendar follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │  Email Service  │    │   File Storage  │
│   (Vite Build)  │    │  (Nodemailer)   │    │   (GridFS)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend Stack

- **React 19**: Modern React with hooks and functional components
- **TypeScript**: Type safety and enhanced developer experience
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing for SPA functionality
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **React Big Calendar**: Calendar component for course visualization

### Backend Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type safety for backend development
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and salting
- **Nodemailer**: Email sending functionality

### Development & Build Tools

- **tsx**: TypeScript execution for development
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Vite**: Frontend build tool
- **TypeDoc**: API documentation generation
- **Docusaurus**: Documentation site generator

## Project Structure

```
ConflictCalendar/
├── backend/                 # Backend application
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic services
│   ├── config/             # Configuration files
│   └── server.ts           # Express server setup
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── lib/            # Shared libraries
│   ├── index.html          # HTML template
│   └── vite.config.ts      # Vite configuration
├── docs/                   # Documentation site
├── .env                    # Environment variables
├── package.json            # Root dependencies
└── typedoc.json           # API docs configuration
```

## Backend Architecture

### MVC Pattern

The backend follows the Model-View-Controller (MVC) architectural pattern:

```
Request → Routes → Controllers → Services → Models → Database
                     ↓
Response ← Views ← Controllers ← Services ← Models ← Database
```

### Directory Structure

```
backend/
├── controllers/            # Request handlers
│   ├── auth.controller.ts  # Authentication logic
│   └── course.controller.ts # Course management logic
├── middleware/             # Custom middleware
│   └── auth.ts            # JWT authentication middleware
├── models/                # Database schemas
│   ├── user.model.ts      # User data model
│   └── course.model.ts    # Course data model
├── routes/                # API endpoints
│   ├── auth.route.ts      # Authentication routes
│   └── course.route.ts    # Course routes
├── services/              # Business logic
│   └── emailService.ts    # Email functionality
├── config/                # Configuration
│   └── db.ts             # Database connection
└── server.ts             # Application entry point
```

### API Design

The API follows RESTful principles:

```
Authentication:
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/forgot-password # Password reset request
POST   /api/auth/reset-password  # Password reset completion

Courses:
GET    /api/courses             # Get user's courses
POST   /api/courses             # Create new course
PUT    /api/courses/:id         # Update course
DELETE /api/courses/:id         # Delete course
```

### Middleware Stack

```
Request
   ↓
CORS Middleware           # Cross-origin resource sharing
   ↓
JSON Parser               # Parse JSON request bodies
   ↓
URL Encoded Parser        # Parse form data
   ↓
Static File Middleware    # Serve frontend build
   ↓
Authentication Middleware # JWT token validation (protected routes)
   ↓
Route Handlers           # Controller functions
   ↓
Error Handling           # Global error handler
   ↓
Response
```

## Frontend Architecture

### Component Architecture

```
App (Router)
├── Navbar (Global Navigation)
├── HomePage (Landing/Dashboard)
├── AuthForm (Login/Register)
├── Calendar (Course Visualization)
├── CourseCard (Course Display)
└── PasswordResetPage (Reset Flow)
```

### State Management

ConflictCalendar uses Zustand for state management:

```typescript
// stores/auth.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

// stores/course.ts
interface CourseStore {
  courses: Course[];
  fetchCourses: () => Promise<void>;
  addCourse: (course: CourseData) => Promise<void>;
  updateCourse: (id: string, course: CourseData) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}
```

### Component Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # Basic UI components
│   │   ├── button.tsx   # Button component
│   │   ├── input.tsx    # Input component
│   │   └── checkbox.tsx # Checkbox component
│   ├── AuthForm.tsx     # Authentication form
│   ├── Calendar.tsx     # Calendar component
│   ├── CourseCard.tsx   # Course display card
│   └── Navbar.tsx       # Navigation bar
├── pages/               # Page components
│   ├── HomePage.tsx     # Main dashboard
│   └── PasswordResetPage.tsx # Password reset
├── services/            # API integration
│   └── apiService.ts    # HTTP client
├── store/               # State management
│   ├── auth.ts          # Authentication state
│   └── course.ts        # Course state
└── utils/               # Utility functions
    └── utils.ts         # Helper functions
```

## Data Flow

### Authentication Flow

```
1. User Login Request
   ↓
2. Frontend → POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. JWT token generated and returned
   ↓
5. Frontend stores token in localStorage
   ↓
6. Subsequent requests include Authorization header
   ↓
7. Backend validates JWT on protected routes
```

### Course Management Flow

```
1. User creates/updates course
   ↓
2. Frontend validates form data
   ↓
3. API request to backend
   ↓
4. Backend validates data and saves to MongoDB
   ↓
5. Response sent to frontend
   ↓
6. Frontend updates local state
   ↓
7. UI re-renders with new data
```

### Password Reset Flow

```
1. User requests password reset
   ↓
2. Backend generates secure token
   ↓
3. Token hashed and saved to database
   ↓
4. Email sent with reset link
   ↓
5. User clicks link with token
   ↓
6. Frontend sends token + new password
   ↓
7. Backend validates token and updates password
   ↓
8. User can login with new password
```

## Database Design

### Schema Architecture

```
Users Collection:
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  resetPasswordToken: String (hashed, optional),
  resetPasswordExpires: Date (optional),
  createdAt: Date,
  updatedAt: Date
}

Courses Collection:
{
  _id: ObjectId,
  title: String,
  instructor: String,
  days: [String], // ['Monday', 'Wednesday']
  startTime: String, // '09:00'
  endTime: String,   // '10:30'
  startDate: Date,
  endDate: Date,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

- **User → Courses**: One-to-Many (user can have multiple courses)
- **Course → User**: Many-to-One (each course belongs to one user)

### Indexes

```javascript
// Users collection
{ email: 1 }        // Unique index for login
{ username: 1 }     // Unique index for registration

// Courses collection
{ userId: 1 }       // Index for user's courses query
{ userId: 1, startDate: 1 } // Compound index for date filtering
```

## Security Architecture

### Authentication Security

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Signed with secret, 7-day expiration
- **Token Storage**: Client-side localStorage
- **Protected Routes**: Middleware validates JWT on API requests

### Data Security

- **Input Validation**: express-validator for request validation
- **SQL Injection**: MongoDB queries use parameterized inputs
- **XSS Protection**: React's built-in XSS protection
- **CORS**: Restricted to frontend domain

### Email Security

- **Reset Tokens**: Cryptographically secure random tokens
- **Token Hashing**: Tokens hashed before database storage
- **Token Expiration**: 1-hour expiration for reset tokens
- **Single Use**: Tokens invalidated after successful reset

## Deployment Architecture

### Development Environment

```
Developer Machine:
├── Frontend (localhost:5173) - Vite dev server
├── Backend (localhost:5000) - tsx with hot reload
├── Database (localhost:27017) - Local MongoDB
└── Email (Mailtrap) - Test email service
```

### Production Environment

```
Render.com:
├── Full-Stack App
│   ├── Backend API (Express server)
│   ├── Frontend (Static files served by Express)
│   └── Build Process (npm run build)
├── MongoDB Atlas - Cloud database
├── Gmail SMTP - Production email
└── HTTPS - SSL termination
```

### Build Process

```
1. npm run build
   ↓
2. Install dependencies
   ↓
3. Install frontend dependencies
   ↓
4. Build frontend (Vite)
   ↓
5. TypeScript compilation
   ↓
6. Static files ready for serving
```

## Performance Considerations

### Frontend Optimization

- **Code Splitting**: React.lazy for component loading
- **Bundle Optimization**: Vite's automatic optimization
- **Asset Optimization**: Image compression and lazy loading
- **Caching**: Browser caching for static assets

### Backend Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Mongoose connection pooling
- **Response Compression**: gzip compression for responses
- **Static File Serving**: Express static middleware

### Monitoring

- **Error Logging**: Console logging for errors
- **Performance Monitoring**: Response time tracking
- **Health Checks**: Basic endpoint monitoring

---

Next: [Database Schema](database-schema)
