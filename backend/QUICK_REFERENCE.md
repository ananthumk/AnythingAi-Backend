# Quick Reference Guide

## Setup Checklist

```bash
# 1. Navigate to project
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with:
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key

# 4. Start development server
npm run dev
```

---

## API Base URL

```
http://localhost:5000/api/v1
```

## API Documentation URL

```
http://localhost:5000/api-docs
```

---

## Quick Endpoints Reference

### Auth Endpoints
```
POST   /auth/register          Register user
POST   /auth/login             Login user
```

### Task Endpoints (User)
```
POST   /task                   Create task
GET    /task                   Get all user tasks
GET    /task/:id               Get task by ID
PATCH  /task/:id               Update task
DELETE /task/:id               Delete task
```

### Admin Endpoints
```
GET    /admin/tasks            Get all tasks
DELETE /admin/tasks/:id        Delete any task
```

---

## Authentication

All protected endpoints require:

```
Authorization: Bearer <token>
```

Get token from login response and include in header.

---

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123456"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high"}'
```

### Get Tasks
```bash
curl http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer TOKEN"
```

### Update Task
```bash
curl -X PATCH http://localhost:5000/api/v1/task/TASK_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in progress"}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/v1/task/TASK_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Task Status Values

```
pending       - Not started
in progress   - Currently being worked on
completed     - Finished
```

## Task Priority Values

```
low           - Low priority
medium        - Medium priority
high          - High priority
```

---

## File Structure

```
backend/
├── src/
│   ├── config/        # Database & Swagger setup
│   ├── controllers/   # Business logic
│   ├── middlleware/   # Auth & validation
│   ├── modal/         # Database schemas
│   ├── routes/        # API endpoints
│   └── validators/    # Input validation
├── package.json
├── server.js          # Main entry point
├── .env               # Environment variables
└── README.md          # Full documentation
```

---

## Validation Rules

### User Registration
- `name`: Min 3 characters
- `email`: Valid format, unique
- `password`: Min 8 characters

### Create Task
- `title`: Min 3 characters (required)
- `description`: Optional
- `status`: Optional (pending|in progress|completed)
- `priority`: Optional (low|medium|high)

---

## Error Response Format

```json
{
  "message": "Error description",
  "errors": ["Detailed error if applicable"]
}
```

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| `Invalid Token` | Token expired, login again |
| `No token provided` | Add Authorization header |
| `validation failed` | Check field values |
| `Task not found` | Verify task ID exists |
| `Access Denied` | Admin endpoint, need admin role |
| `Unauthorized to view this task` | Task belongs to another user |

---

## Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Run tests (if configured)
npm test
```

---

## Testing Quick Commands

### Postman
1. Import API from Swagger: `http://localhost:5000/api-docs`
2. Set environment variables: `base_url`, `token`
3. Use {{base_url}} and {{token}} in requests

### cURL
1. Save responses: `response=$(curl ...)`
2. Extract token: `token=$(echo $response | jq '.token')`
3. Use in requests: `Authorization: Bearer $token`

### Swagger UI
1. Go to `http://localhost:5000/api-docs`
2. Click "Try it out"
3. Fill parameters
4. Click "Execute"

---

## Useful MongoDB Queries

```javascript
// View all users
db.users.find()

// View all tasks
db.tasks.find()

// Find tasks by user
db.tasks.find({ createdBy: ObjectId("USER_ID") })

// Find tasks by status
db.tasks.find({ status: "pending" })

// Update task
db.tasks.updateOne({ _id: ObjectId("ID") }, { $set: { status: "completed" } })

// Delete task
db.tasks.deleteOne({ _id: ObjectId("ID") })
```

---

## Performance Tips

1. **Database Queries**: Limited with `.find()` and `.sort()`
2. **Validation**: Done before database operations
3. **Passwords**: Hashed with bcryptjs (10 rounds)
4. **Tokens**: Cached in memory on client side
5. **CORS**: Enabled for all origins (configure in production)

---

## Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ Password-only with `select: false`
- ✅ Expiring tokens (7 days)
- ⚠️ TODO: Add CORS whitelist for production
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add request logging

---

## Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Use different port
PORT=3000 npm run dev
```

### Can't connect to MongoDB
```javascript
// Check connection string in .env
MONGO_URI=mongodb+srv://user:pass@cluster.net/db

// Test in MongoDB shell
mongosh "mongodb+srv://user:pass@cluster.net/"
```

### Token errors
```bash
# Token expired - login again
# Invalid token - verify format: Bearer <token>
# No token - add Authorization header
```

### Validation errors
```javascript
// Check error message for details
{
  "message": "validation failed",
  "errors": ["Title must be atleast 3 characters"]
}
```

---

## Important Links

| Resource | URL |
|----------|-----|
| Full Docs | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |
| Testing Guide | [TESTING_GUIDE.md](TESTING_GUIDE.md) |
| Code Review | [CODE_REVIEW.md](CODE_REVIEW.md) |
| API Docs UI | http://localhost:5000/api-docs |
| NPM Packages | [package.json](package.json) |

---

## Node Modules to Install

```bash
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `zod` - Input validation
- `swagger-jsdoc` - API documentation
- `swagger-ui-express` - Swagger UI
- `nodemon` - Dev server (auto restart)

---

## Project Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.1.6",
  "zod": "^3.22.4",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

---

## Contact & Support

For questions:
1. Check documentation files in root
2. Review Swagger UI at `/api-docs`
3. Check error messages in responses
4. Review code comments in `/src` folders

---

**Last Updated**: February 6, 2024
**Version**: 1.0.0
