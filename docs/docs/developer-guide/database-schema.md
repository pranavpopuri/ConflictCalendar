# Database Schema

ConflictCalendar uses MongoDB as its primary database with Mongoose for object modeling. This document describes the database schema and relationships.

## Overview

The application uses two main collections:

- **users**: Store user account information
- **courses**: Store course/schedule information

## Collections

### Users Collection

Stores user account information, authentication data, and password reset tokens.

#### Schema Definition

```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Mongoose Schema

```typescript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});
```

#### Field Details

| Field                  | Type     | Required | Description            | Constraints                           |
| ---------------------- | -------- | -------- | ---------------------- | ------------------------------------- |
| `_id`                  | ObjectId | Auto     | Primary key            | Unique, Auto-generated                |
| `username`             | String   | Yes      | User's display name    | 3-50 chars, alphanumeric + underscore |
| `email`                | String   | Yes      | User's email address   | Valid email format, unique            |
| `password`             | String   | Yes      | Hashed password        | Minimum 6 characters (hashed)         |
| `resetPasswordToken`   | String   | No       | Password reset token   | Hashed token, nullable                |
| `resetPasswordExpires` | Date     | No       | Token expiration       | Date/time, nullable                   |
| `createdAt`            | Date     | Auto     | Account creation date  | Auto-generated                        |
| `updatedAt`            | Date     | Auto     | Last modification date | Auto-updated                          |

#### Indexes

```javascript
// Unique indexes for authentication
{ email: 1 }        // Login lookup
{ username: 1 }     // Registration validation

// Reset token lookup (sparse for null values)
{ resetPasswordToken: 1 }  // Password reset
```

#### Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Email Normalization**: Lowercase and trimmed
- **Token Security**: Reset tokens are hashed before storage
- **Unique Constraints**: Email and username must be unique

---

### Courses Collection

Stores course information including schedule details and associations with users.

#### Schema Definition

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

#### Mongoose Schema

```typescript
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  instructor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  days: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  }],
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});
```

#### Field Details

| Field        | Type     | Required | Description           | Constraints              |
| ------------ | -------- | -------- | --------------------- | ------------------------ |
| `_id`        | ObjectId | Auto     | Primary key           | Unique, Auto-generated   |
| `title`      | String   | Yes      | Course title          | Max 100 characters       |
| `instructor` | String   | Yes      | Instructor name       | Max 50 characters        |
| `days`       | Array    | Yes      | Days of the week      | Valid weekday names      |
| `startTime`  | String   | Yes      | Class start time      | HH:MM format (24-hour)   |
| `endTime`    | String   | Yes      | Class end time        | HH:MM format (24-hour)   |
| `startDate`  | Date     | Yes      | Course start date     | Valid date               |
| `endDate`    | Date     | Yes      | Course end date       | Must be after start date |
| `userId`     | ObjectId | Yes      | Course owner          | Reference to User        |
| `createdAt`  | Date     | Auto     | Creation timestamp    | Auto-generated           |
| `updatedAt`  | Date     | Auto     | Last update timestamp | Auto-updated             |

#### Validation Rules

```typescript
// Custom validation
courseSchema.pre('save', function(next) {
  // End time must be after start time
  if (this.endTime <= this.startTime) {
    return next(new Error('End time must be after start time'));
  }

  // End date must be after start date
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }

  // At least one day must be selected
  if (this.days.length === 0) {
    return next(new Error('At least one day must be selected'));
  }

  next();
});
```

#### Indexes

```javascript
// User-specific queries
{ userId: 1 }                    // Get user's courses

// Compound indexes for filtering
{ userId: 1, startDate: 1 }      // Date-range queries
{ userId: 1, days: 1 }           // Day-based filtering
{ userId: 1, startTime: 1 }      // Time-based sorting

// Conflict detection queries
{ userId: 1, days: 1, startDate: 1, endDate: 1 }  // Conflict checking
```

## Relationships

### User → Courses (One-to-Many)

Each user can have multiple courses, but each course belongs to exactly one user.

```typescript
// Populate user's courses
const userWithCourses = await User.findById(userId).populate('courses');

// Reference in course schema
const course = await Course.findById(courseId).populate('userId');
```

### Relationship Implementation

```typescript
// Virtual field in User model (optional)
userSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'userId'
});
```

## Data Integrity

### Referential Integrity

- **Foreign Key**: `userId` in courses references `_id` in users
- **Cascade Delete**: When user is deleted, their courses should be deleted
- **Orphan Prevention**: Courses cannot exist without a valid user

```typescript
// Middleware to handle user deletion
userSchema.pre('remove', async function(next) {
  await Course.deleteMany({ userId: this._id });
  next();
});
```

### Data Validation

#### Time Validation

```typescript
// Time format validation
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Time logic validation
function validateTimeRange(startTime: string, endTime: string): boolean {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  return end > start;
}
```

#### Date Validation

```typescript
// Date range validation
function validateDateRange(startDate: Date, endDate: Date): boolean {
  return endDate > startDate;
}
```

#### Day Validation

```typescript
const validDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday'
];

function validateDays(days: string[]): boolean {
  return days.length > 0 && days.every(day => validDays.includes(day));
}
```

## Performance Optimization

### Query Optimization

```typescript
// Efficient user courses query
const courses = await Course.find({ userId })
  .select('title instructor days startTime endTime startDate endDate')
  .sort({ startDate: 1, startTime: 1 });

// Conflict detection query
const conflictingCourses = await Course.find({
  userId,
  days: { $in: newCourse.days },
  $or: [
    {
      startDate: { $lte: newCourse.endDate },
      endDate: { $gte: newCourse.startDate }
    }
  ]
});
```

### Index Strategy

```javascript
// Most frequently used queries
db.courses.createIndex({ userId: 1 });                    // Primary filter
db.courses.createIndex({ userId: 1, startDate: 1 });      // Date sorting
db.courses.createIndex({ userId: 1, days: 1 });           // Day filtering

// User authentication
db.users.createIndex({ email: 1 });                       // Login
db.users.createIndex({ username: 1 });                    // Registration
db.users.createIndex({ resetPasswordToken: 1 });          // Password reset
```

## Migration Considerations

### Schema Versioning

When updating the schema, consider:

1. **Backward Compatibility**: Ensure existing data remains valid
2. **Migration Scripts**: Provide scripts for data transformation
3. **Rollback Strategy**: Plan for rolling back schema changes

### Future Enhancements

Potential schema additions:

```typescript
// Enhanced course schema
interface EnhancedCourse extends Course {
  description?: string;           // Course description
  credits?: number;              // Credit hours
  room?: string;                 // Classroom location
  color?: string;                // Calendar display color
  recurrence?: RecurrenceRule;   // Complex scheduling rules
  assignments?: Assignment[];     // Course assignments
  notifications?: Notification[]; // Reminders and alerts
}
```

## Backup and Recovery

### Backup Strategy

```bash
# Daily automated backups
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/conflictcalendar"

# Collection-specific backup
mongodump --uri="mongodb+srv://..." --collection=users
mongodump --uri="mongodb+srv://..." --collection=courses
```

### Recovery Procedures

```bash
# Full database restore
mongorestore --uri="mongodb+srv://..." backup/

# Collection-specific restore
mongorestore --uri="mongodb+srv://..." --collection=users backup/users.bson
```

---

Next: [API Reference](../api/)
