# Course API

Course management endpoints for creating, reading, updating, and deleting courses.

## GET /courses

Retrieve all courses for the authenticated user.

### Request

```http
GET /api/courses
Authorization: Bearer <jwt-token>
```

### Headers

| Header          | Value                | Required |
| --------------- | -------------------- | -------- |
| `Authorization` | `Bearer <jwt-token>` | Yes      |

### Response

**Success (200 OK):**

```json
{
  "courses": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "title": "Introduction to Computer Science",
      "instructor": "Dr. Smith",
      "days": ["Monday", "Wednesday", "Friday"],
      "startTime": "09:00",
      "endTime": "10:30",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-05-15T00:00:00.000Z",
      "userId": "64f5a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Error (401 Unauthorized):**

```json
{
  "message": "Access denied. No token provided."
}
```

---

## POST /courses

Create a new course for the authenticated user.

### Request

```http
POST /api/courses
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Data Structures and Algorithms",
  "instructor": "Prof. Johnson",
  "days": ["Tuesday", "Thursday"],
  "startTime": "14:00",
  "endTime": "15:30",
  "startDate": "2024-01-15",
  "endDate": "2024-05-15"
}
```

### Request Body

| Field        | Type     | Required | Description                       |
| ------------ | -------- | -------- | --------------------------------- |
| `title`      | string   | Yes      | Course title (1-100 characters)   |
| `instructor` | string   | Yes      | Instructor name (1-50 characters) |
| `days`       | string[] | Yes      | Array of weekday names            |
| `startTime`  | string   | Yes      | Start time in HH:MM format        |
| `endTime`    | string   | Yes      | End time in HH:MM format          |
| `startDate`  | string   | Yes      | Course start date (ISO date)      |
| `endDate`    | string   | Yes      | Course end date (ISO date)        |

### Valid Days

- "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"

### Time Format

- **Format**: "HH:MM" (24-hour format)
- **Examples**: "09:00", "14:30", "23:59"

### Response

**Success (201 Created):**

```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
    "title": "Data Structures and Algorithms",
    "instructor": "Prof. Johnson",
    "days": ["Tuesday", "Thursday"],
    "startTime": "14:00",
    "endTime": "15:30",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-05-15T00:00:00.000Z",
    "userId": "64f5a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error (400 Bad Request):**

```json
{
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "startTime",
      "message": "Start time must be in HH:MM format"
    }
  ]
}
```

---

## PUT /courses/:id

Update an existing course.

### Request

```http
PUT /api/courses/64f5a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Advanced Computer Science",
  "instructor": "Dr. Smith",
  "days": ["Monday", "Wednesday"],
  "startTime": "10:00",
  "endTime": "11:30",
  "startDate": "2024-01-15",
  "endDate": "2024-05-15"
}
```

### URL Parameters

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `id`      | string | Course ID (MongoDB ObjectId) |

### Request Body

Same as POST /courses - all fields are optional for updates.

### Response

**Success (200 OK):**

```json
{
  "message": "Course updated successfully",
  "course": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "title": "Advanced Computer Science",
    "instructor": "Dr. Smith",
    "days": ["Monday", "Wednesday"],
    "startTime": "10:00",
    "endTime": "11:30",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-05-15T00:00:00.000Z",
    "userId": "64f5a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-02T10:30:00.000Z"
  }
}
```

**Error (404 Not Found):**

```json
{
  "message": "Course not found"
}
```

**Error (403 Forbidden):**

```json
{
  "message": "Access denied. You can only update your own courses."
}
```

---

## DELETE /courses/:id

Delete a course.

### Request

```http
DELETE /api/courses/64f5a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <jwt-token>
```

### URL Parameters

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `id`      | string | Course ID (MongoDB ObjectId) |

### Response

**Success (200 OK):**

```json
{
  "message": "Course deleted successfully"
}
```

**Error (404 Not Found):**

```json
{
  "message": "Course not found"
}
```

**Error (403 Forbidden):**

```json
{
  "message": "Access denied. You can only delete your own courses."
}
```

---

## Validation Rules

### Course Title

- **Required**: Yes
- **Type**: String
- **Length**: 1-100 characters
- **Example**: "Introduction to Computer Science"

### Instructor

- **Required**: Yes
- **Type**: String
- **Length**: 1-50 characters
- **Example**: "Dr. Smith"

### Days

- **Required**: Yes
- **Type**: Array of strings
- **Valid values**: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
- **Minimum**: 1 day
- **Example**: ["Monday", "Wednesday", "Friday"]

### Time Fields

- **Format**: "HH:MM" (24-hour)
- **Range**: "00:00" to "23:59"
- **Validation**: End time must be after start time
- **Examples**: "09:00", "14:30"

### Date Fields

- **Format**: ISO date string ("YYYY-MM-DD")
- **Validation**: End date must be after start date
- **Examples**: "2024-01-15", "2024-05-15"

---

## Conflict Detection

The system automatically detects scheduling conflicts when creating or updating courses:

### Conflict Criteria

Two courses conflict if they:

1. Belong to the same user
2. Have overlapping date ranges
3. Share at least one common day
4. Have overlapping time periods

### Conflict Response

When a conflict is detected:

```json
{
  "message": "Course conflicts with existing course",
  "conflicts": [
    {
      "courseId": "64f5a1b2c3d4e5f6a7b8c9d0",
      "title": "Existing Course",
      "conflictingDays": ["Monday"],
      "conflictingTimes": "09:00-10:30"
    }
  ]
}
```

### Resolution

To resolve conflicts:

1. Modify the schedule times
2. Change the days of the week
3. Adjust the date range
4. Delete the conflicting course

---

## Implementation Details

### Database Schema

```typescript
interface Course {
  _id: ObjectId;
  title: string;
  instructor: string;
  days: string[];
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

```javascript
// Optimized queries
{ userId: 1 }                    // User's courses
{ userId: 1, startDate: 1 }      // Date-filtered courses
{ userId: 1, days: 1 }           // Day-filtered courses
```

### Performance Considerations

- Courses are filtered by `userId` to ensure data isolation
- Date range queries use indexed fields
- Conflict detection is performed server-side
- Large course lists are paginated (future enhancement)
