# Course API

Course management endpoints implemented in `/backend/controllers/course.controller.ts`.

## Get User Courses {#get-courses}

**GET** `/api/courses`

```typescript
// Controller implementation
export const getCourses = async (req: AuthRequest, res: Response) => {
  // req.user populated by authenticate middleware
  const courses = await Course.find({ user: req.user._id })
  res.status(200).json({ success: true, data: courses })
}
```

**Headers:** `Authorization: Bearer <jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Computer Science 101",
      "startTime": 900,    // Minutes from midnight (9:00 AM)
      "endTime": 1050,     // Minutes from midnight (10:30 AM)
      "days": ["Monday", "Wednesday", "Friday"],
      "user": "user_id",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## Create Course {#create-course}

**POST** `/api/courses`

```typescript
// Controller implementation
export const createCourse = async (req: AuthRequest, res: Response) => {
  const course = req.body

  // Validate required fields
  if (!course.name || !course.startTime || !course.endTime || !course.days) {
    return res.status(400).json({ success: false, message: "Missing required fields" })
  }

  const newCourse = new Course({ ...course, user: req.user._id })
  await newCourse.save()

  res.status(201).json({ success: true, data: newCourse })
}
```

**Request:**
```json
{
  "name": "Physics 201",
  "startTime": 780,   // 1:00 PM (780 minutes from midnight)
  "endTime": 950,     // 3:50 PM
  "days": ["Tuesday", "Thursday"]
}
```

## Update Course {#update-course}

**PUT** `/api/courses/:id`

```typescript
// Controller implementation
export const updateCourse = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const course = req.body

  const existingCourse = await Course.findById(id)

  // Check ownership
  if (existingCourse.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" })
  }

  const updatedCourse = await Course.findByIdAndUpdate(id, course, { new: true })
  res.status(200).json({ success: true, data: updatedCourse })
}
```

## Delete Course {#delete-course}

**DELETE** `/api/courses/:id`

```typescript
// Controller implementation
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const existingCourse = await Course.findById(id)

  // Check ownership
  if (existingCourse.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" })
  }

  await Course.findByIdAndDelete(id)
  res.status(200).json({ success: true, message: "Course deleted" })
}
```

## Course Schema

Defined in `/backend/models/course.model.ts`:

```typescript
export interface ICourse extends Document {
  name: string
  startTime: number      // Minutes from midnight
  endTime: number        // Minutes from midnight
  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>
  user: mongoose.Types.ObjectId  // Reference to User
  createdAt?: Date
  updatedAt?: Date
}

const courseSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  days: {
    type: [String],
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })
```

## Time Format

- **startTime/endTime**: Stored as minutes from midnight (0-1439)
- **Example conversions:**
  - 9:00 AM = 540 minutes
  - 1:30 PM = 810 minutes
  - 11:45 PM = 1425 minutes
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
