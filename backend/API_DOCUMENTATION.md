# Task Management API - Complete Documentation

## Overview
This is a comprehensive RESTful API for managing tasks with user authentication and role-based access control (RBAC). The API supports user registration, authentication, and task management with admin capabilities.

---

## Base URL
```
http://localhost:5000/api/v1
```

## API Documentation UI
Swagger UI: `http://localhost:5000/api-docs`

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Task Endpoints](#task-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Error Handling](#error-handling)
5. [Status Codes](#status-codes)
6. [Authentication](#authentication)
7. [Request/Response Examples](#requestresponse-examples)

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // Optional: "user" or "admin", defaults to "user"
}
```

#### Query Parameters
None

#### Headers
```
Content-Type: application/json
```

#### Response (201 Created)
```json
{
  "message": "User successfully registered",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-02-06T10:30:00Z",
    "updatedAt": "2024-02-06T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses
- **400 Bad Request** - User already exists or validation failed
- **500 Server Error** - Internal server error

#### Validation Rules
- `name`: Required, minimum 3 characters
- `email`: Required, must be valid email format, must be unique
- `password`: Required, minimum 8 characters
- `role`: Optional, must be "user" or "admin"

---

### 2. Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Headers
```
Content-Type: application/json
```

#### Response (200 OK)
```json
{
  "message": "Logged In",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-02-06T10:30:00Z",
    "updatedAt": "2024-02-06T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses
- **400 Bad Request** - Invalid password
- **404 Not Found** - User not found
- **500 Server Error** - Internal server error

#### Validation Rules
- `email`: Required, must be valid email format
- `password`: Required, minimum 1 character

---

## Task Endpoints

### 1. Create Task
**POST** `/task`

Create a new task for the authenticated user.

#### Authentication
**Required**: Bearer Token in Authorization header

#### Request Body
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the project",
  "status": "pending",
  "priority": "high"
}
```

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Response (201 Created)
```json
{
  "message": "Task added successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation for the project",
    "status": "pending",
    "priority": "high",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-02-06T10:35:00Z",
    "updatedAt": "2024-02-06T10:35:00Z"
  }
}
```

#### Error Responses
- **400 Bad Request** - Validation error
- **401 Unauthorized** - No token or invalid token
- **500 Server Error** - Internal server error

#### Validation Rules
- `title`: Required, minimum 3 characters
- `description`: Optional
- `status`: Optional, must be one of: "pending", "in progress", "completed"
- `priority`: Optional, must be one of: "low", "medium", "high"

---

### 2. Get All User Tasks
**GET** `/task`

Retrieve all tasks created by the authenticated user.

#### Authentication
**Required**: Bearer Token in Authorization header

#### Query Parameters
None

#### Headers
```
Authorization: Bearer <token>
```

#### Response (200 OK)
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "priority": "high",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-02-06T10:35:00Z",
      "updatedAt": "2024-02-06T10:35:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Setup database",
      "description": "Configure MongoDB connection",
      "status": "in progress",
      "priority": "medium",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-02-06T10:30:00Z",
      "updatedAt": "2024-02-06T10:32:00Z"
    }
  ]
}
```

#### Error Responses
- **401 Unauthorized** - No token or invalid token
- **500 Server Error** - Internal server error

---

### 3. Get Task by ID
**GET** `/task/{id}`

Retrieve a specific task by its ID. User can only view tasks they created.

#### Authentication
**Required**: Bearer Token in Authorization header

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (MongoDB ObjectId) |

#### Headers
```
Authorization: Bearer <token>
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-02-06T10:35:00Z",
  "updatedAt": "2024-02-06T10:35:00Z"
}
```

#### Error Responses
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - Unauthorized to view this task
- **404 Not Found** - Task not found
- **500 Server Error** - Internal server error

---

### 4. Update Task
**PATCH** `/task/{id}`

Update a task. User can only update tasks they created.

#### Authentication
**Required**: Bearer Token in Authorization header

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (MongoDB ObjectId) |

#### Request Body
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in progress",
  "priority": "medium"
}
```

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Response (200 OK)
```json
{
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in progress",
    "priority": "medium",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-02-06T10:35:00Z",
    "updatedAt": "2024-02-06T10:40:00Z"
  }
}
```

#### Error Responses
- **400 Bad Request** - Validation error or no fields to update
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - Unauthorized to update this task
- **404 Not Found** - Task not found
- **500 Server Error** - Internal server error

#### Validation Rules
- All fields are optional
- `status`: Must be one of: "pending", "in progress", "completed"
- `priority`: Must be one of: "low", "medium", "high"

---

### 5. Delete Task
**DELETE** `/task/{id}`

Delete a task. User can only delete tasks they created.

#### Authentication
**Required**: Bearer Token in Authorization header

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (MongoDB ObjectId) |

#### Headers
```
Authorization: Bearer <token>
```

#### Response (200 OK)
```json
{
  "message": "Task deleted successfully"
}
```

#### Error Responses
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - Unauthorized to delete this task
- **404 Not Found** - Task not found
- **500 Server Error** - Internal server error

---

## Admin Endpoints

### Prerequisites
- User must have `role: "admin"`
- Must provide valid JWT token in Authorization header

### 1. Get All Tasks (Admin)
**GET** `/admin/tasks`

Retrieve all tasks in the system (admin privilege required).

#### Authentication
**Required**: Bearer Token in Authorization header
**Required Role**: Admin

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Response (200 OK)
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "priority": "high",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-02-06T10:35:00Z",
      "updatedAt": "2024-02-06T10:35:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Setup database",
      "description": "Configure MongoDB connection",
      "status": "in progress",
      "priority": "medium",
      "createdBy": "507f1f77bcf86cd799439022",
      "createdAt": "2024-02-06T10:30:00Z",
      "updatedAt": "2024-02-06T10:32:00Z"
    }
  ]
}
```

#### Error Responses
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - User is not an admin
- **500 Server Error** - Internal server error

---

### 2. Delete Any Task (Admin)
**DELETE** `/admin/tasks/{id}`

Delete any task in the system (admin privilege required).

#### Authentication
**Required**: Bearer Token in Authorization header
**Required Role**: Admin

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (MongoDB ObjectId) |

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Response (200 OK)
```json
{
  "message": "Task deleted successfully"
}
```

#### Error Responses
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - User is not an admin
- **404 Not Found** - Task not found
- **500 Server Error** - Internal server error

---

## Error Handling

### Error Response Format
All error responses follow this format:

```json
{
  "message": "Error description",
  "errors": ["Additional error details if applicable"]
}
```

### Common Error Scenarios

#### 1. Validation Error (400)
```json
{
  "message": "validation failed",
  "errors": [
    "Title must be atleast 3 characters",
    "Invalid email format"
  ]
}
```

#### 2. Authentication Error (401)
```json
{
  "message": "Invalid Token"
}
```

OR

```json
{
  "message": "No token provided"
}
```

#### 3. Authorization Error (403)
```json
{
  "message": "Access Denied"
}
```

OR

```json
{
  "message": "Unauthorized to view this task"
}
```

#### 4. Not Found Error (404)
```json
{
  "message": "Task not found"
}
```

#### 5. Server Error (500)
```json
{
  "message": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| **200** | OK - Request successful |
| **201** | Created - Resource created successfully |
| **400** | Bad Request - Validation or syntax error |
| **401** | Unauthorized - Authentication required or failed |
| **403** | Forbidden - Authenticated but not authorized |
| **404** | Not Found - Resource does not exist |
| **500** | Internal Server Error - Server error |

---

## Authentication

### JWT Token Format
Tokens are JWT (JSON Web Tokens) that expire after 7 days.

### How to Use Token
1. Register or Login to get a token
2. Include token in Authorization header: `Authorization: Bearer <token>`
3. Token is automatically decoded on the server to verify user identity

### Token Payload
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "user",
  "iat": 1707211800,
  "exp": 1707816600
}
```

---

## Request/Response Examples

### Example 1: User Registration

**Request:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "message": "User successfully registered",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-02-06T10:30:00Z",
    "updatedAt": "2024-02-06T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA3MjExODAwLCJleHAiOjE3MDc4MTY2MDB9.xxx"
}
```

---

### Example 2: Create Task

**Request:**
```bash
curl -X POST http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API documentation",
    "description": "Write comprehensive documentation for all endpoints",
    "priority": "high"
  }'
```

**Response:**
```json
{
  "message": "Task added successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete API documentation",
    "description": "Write comprehensive documentation for all endpoints",
    "status": "pending",
    "priority": "high",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-02-06T10:35:00Z",
    "updatedAt": "2024-02-06T10:35:00Z"
  }
}
```

---

### Example 3: Get All Tasks

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete API documentation",
      "description": "Write comprehensive documentation",
      "status": "pending",
      "priority": "high",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-02-06T10:35:00Z",
      "updatedAt": "2024-02-06T10:35:00Z"
    }
  ]
}
```

---

### Example 4: Update Task

**Request:**
```bash
curl -X PATCH http://localhost:5000/api/v1/task/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in progress",
    "priority": "medium"
  }'
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete API documentation",
    "description": "Write comprehensive documentation",
    "status": "in progress",
    "priority": "medium",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-02-06T10:35:00Z",
    "updatedAt": "2024-02-06T10:38:00Z"
  }
}
```

---

### Example 5: Delete Task

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/v1/task/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

### Example 6: Admin - Get All Tasks

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/admin/tasks \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete API documentation",
      "description": "Write comprehensive documentation",
      "status": "pending",
      "priority": "high",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-02-06T10:35:00Z",
      "updatedAt": "2024-02-06T10:35:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Setup database",
      "description": "Configure MongoDB",
      "status": "completed",
      "priority": "high",
      "createdBy": "507f1f77bcf86cd799439022",
      "createdAt": "2024-02-06T10:30:00Z",
      "updatedAt": "2024-02-06T10:45:00Z"
    }
  ]
}
```

---

## API Testing

### Using Postman
1. Open Postman
2. Create a new request
3. Set method and URL
4. Add Authorization header with Bearer token
5. Set request body (if applicable)
6. Send request

### Using cURL
See examples above in [Request/Response Examples](#requestresponse-examples)

### Using Swagger UI
1. Navigate to `http://localhost:5000/api-docs`
2. Click on any endpoint to expand
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"

---

## Implementation Notes

### Roles and Permissions
- **User**: Can manage only their own tasks
- **Admin**: Can view and delete any task in the system

### Task Status
- `pending` - Task has not been started
- `in progress` - Task is currently being worked on
- `completed` - Task has been finished

### Task Priority
- `low` - Low priority task
- `medium` - Medium priority task
- `high` - High priority task

### Field Validation
- **Email**: Must be unique in the system
- **Password**: Minimum 8 characters, stored as bcrypt hash
- **Title**: Minimum 3 characters
- **Description**: Optional text field

---

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Passwords stored using bcrypt algorithm
3. **Role-Based Access Control**: Different permissions for users and admins
4. **Validation**: All inputs validated using Zod schema
5. **HTTP Only Tokens**: Tokens don't include sensitive data
6. **Expiring Tokens**: Tokens expire after 7 days

---

## Database Schema

### User Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Task Collection
```
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (enum: ['pending', 'in progress', 'completed']),
  priority: String (enum: ['low', 'medium', 'high']),
  createdBy: ObjectId (ref: User),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Version History

### Version 1.0.0 (Current)
- User authentication (register, login)
- Task management (CRUD operations)
- Admin capabilities
- JWT token-based security
- Input validation using Zod
- Swagger API documentation

---

## Support and Contact

For issues or questions about the API:
1. Check Swagger documentation at `/api-docs`
2. Review error messages in API responses
3. Check validation rules for input fields

---

**Last Updated**: February 6, 2024
**API Version**: 1.0.0
