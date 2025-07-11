# API Reference

ConflictCalendar provides a RESTful API for managing user authentication and course data.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://conflictcalendar.onrender.com/api`

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## Endpoints

### Authentication Endpoints

- [POST /auth/register](auth#register) - User registration
- [POST /auth/login](auth#login) - User login
- [POST /auth/forgot-password](auth#forgot-password) - Request password reset
- [POST /auth/reset-password](auth#reset-password) - Complete password reset

### Course Endpoints

- [GET /courses](courses#get-courses) - Get user's courses
- [POST /courses](courses#create-course) - Create new course
- [PUT /courses/:id](courses#update-course) - Update course
- [DELETE /courses/:id](courses#delete-course) - Delete course

## Rate Limiting

Currently, there are no rate limits imposed on API requests. However, reasonable usage is expected.

## Error Codes

| HTTP Status | Description                             |
| ----------- | --------------------------------------- |
| 200         | Success                                 |
| 201         | Created                                 |
| 400         | Bad Request - Invalid input             |
| 401         | Unauthorized - Invalid or missing token |
| 404         | Not Found - Resource doesn't exist      |
| 409         | Conflict - Resource already exists      |
| 500         | Internal Server Error                   |

## Development

The API is built with:

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Email**: Nodemailer

For detailed implementation, see the [Developer Guide](../developer-guide/architecture).
