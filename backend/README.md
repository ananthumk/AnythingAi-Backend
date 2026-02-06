# Task Management API

A comprehensive Node.js/Express REST API for task management with user authentication and role-based access control. Built with MongoDB, JWT authentication, and Zod validation.

## Features

✅ **User Authentication**
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Token expiration (7 days)

✅ **Task Management**
- Create, read, update, delete tasks
- Task status tracking (pending, in progress, completed)
- Task priority levels (low, medium, high)
- User-specific task isolation

✅ **Role-Based Access Control (RBAC)**
- User role: Manage own tasks only
- Admin role: View and delete any task

✅ **Input Validation**
- Schema validation using Zod
- Email format validation
- Password strength requirements
- Request body validation middleware

✅ **API Documentation**
- Swagger UI at `/api-docs`
- Comprehensive markdown documentation
- Request/response examples
- Error handling guide

✅ **Error Handling**
- Standardized error responses
- Detailed validation messages
- HTTP status codes
- Try-catch error handling

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **Validation** | Zod |
| **Documentation** | Swagger/OpenAPI + JSDoc |
| **Environment** | dotenv |
| **API Testing** | cURL, Postman, Swagger UI |

## Prerequisites

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **MongoDB** (Cloud Atlas or Local)
- **Git**

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Replace the values with your actual MongoDB credentials and a secure JWT secret.

### 4. Start the Server

**Development** (with hot reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The server will start at `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── swagger.js            # Swagger configuration
│   ├── controllers/
│   │   ├── userController.js     # Auth logic
│   │   └── taskController.js     # Task CRUD logic
│   ├── middlleware/
│   │   └── authMiddleware.js     # JWT & Role validation
│   ├── modal/
│   │   ├── user.js               # User schema
│   │   └── tasks.js              # Task schema
│   ├── routes/
│   │   ├── userRoutes.js         # Auth endpoints
│   │   └── taskRoutes.js         # Task endpoints
│   └── validators/
│       ├── validate.js           # Validation middleware
│       ├── authvalidators.js     # Auth schema validators
│       └── taskValidator.js      # Task schema validators
├── server.js                      # Entry point
├── package.json
├── .env                          # Environment variables
├── API_DOCUMENTATION.md          # Full API documentation
├── CODE_REVIEW.md               # Code quality report
└── README.md                     # This file
```

## API Endpoints Overview

### Authentication Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |

### Task Routes (User)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/task` | Create task | ✅ |
| GET | `/task` | Get all user tasks | ✅ |
| GET | `/task/{id}` | Get task by ID | ✅ |
| PATCH | `/task/{id}` | Update task | ✅ |
| DELETE | `/task/{id}` | Delete task | ✅ |

### Admin Routes
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/admin/tasks` | Get all tasks | ✅ | Admin |
| DELETE | `/admin/tasks/{id}` | Delete any task | ✅ | Admin |

## Quick Start Guide

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Save the returned token**

### 3. Create a Task
```bash
curl -X POST http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the API",
    "priority": "high"
  }'
```

### 4. Get All Tasks
```bash
curl -X GET http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer <your-token>"
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

## API Documentation

### Swagger UI
Interactive API documentation available at:
```
http://localhost:5000/api-docs
```

### Features:
- ✅ Try endpoints directly from browser
- ✅ View request/response schemas
- ✅ Test with different parameters
- ✅ Automatically generated from code comments

### Markdown Documentation
Detailed documentation available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md) including:
- All endpoint specifications
- Request/response examples
- Error handling guide
- Authentication details
- Status codes reference

## Authentication & Security

### JWT Token
- Tokens expire after **7 days**
- Include token in `Authorization` header: `Bearer <token>`
- Tokens contain user ID and role

### Password Security
- Passwords hashed using **bcryptjs** (10 rounds)
- No plaintext passwords in database
- Password never returned in API responses

### Role-Based Access
- **User**: Can only manage own tasks
- **Admin**: Full access to all tasks

## Input Validation

All inputs are validated using **Zod** schemas:

### User Registration
- `name`: Min 3 characters
- `email`: Valid email format, unique
- `password`: Min 8 characters

### User Login
- `email`: Valid email format
- `password`: Min 1 character

### Create Task
- `title`: Min 3 characters (required)
- `description`: Optional
- `status`: pending|in progress|completed (optional)
- `priority`: low|medium|high (optional)

### Update Task
- All fields optional
- Same validation rules as create

## Error Handling

### Standard Error Response
```json
{
  "message": "Error description",
  "errors": ["detailed error message"]
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required/failed)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Server Error

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed error examples.

## Environment Variables

```env
# Server Port
PORT=5000

# MongoDB Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/taskdb

# JWT Secret Key (use a strong, random string in production)
JWT_SECRET=your-super-secret-key-min-32-characters-recommended
```

### Important Security Notes
1. ✅ Never commit `.env` file to version control
2. ✅ Use different passwords for development and production
3. ✅ Generate a strong JWT_SECRET for production
4. ✅ Use environment variables in deployment (Heroku, AWS, etc.)

## Development

### Running Tests
Tests can be added using Jest or Mocha:
```bash
npm test
```

### Code Quality
Check code review in [CODE_REVIEW.md](CODE_REVIEW.md) for:
- All bugs fixed
- Code improvements made
- Security considerations
- Performance optimizations

### Folder Naming Note
⚠️ Folder names have typos (by design for learning):
- `middlleware` → should be `middleware` (extra 'l')
- `modal` → should be `models`

These can be renamed in a production environment.

## Common Issues & Solutions

### Issue: Connection Error to MongoDB
**Solution**: Check MONGO_URI in .env file:
```bash
# Correct format
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Issue: Token Expired
**Solution**: Login again to get a new token (expires in 7 days)

### Issue: Validation Error
**Solution**: Check error message for required fields:
```json
{
  "message": "validation failed",
  "errors": ["Title must be atleast 3 characters"]
}
```

### Issue: Unauthorized (401)
**Solution**: 
1. Make sure token is in Authorization header
2. Format: `Authorization: Bearer <token>`
3. Token may be expired, login again

### Issue: Access Denied (403)
**Solution**: 
1. This is not an admin endpoint
2. Task created by another user
3. Check your role (must be admin for admin endpoints)

## Performance Optimization

### Current Optimizations
- Database indexing on email (unique)
- Efficient query sorting and filtering
- Error handling prevents unnecessary processing
- Input validation prevents malformed data

### Future Improvements
- Add pagination for task lists
- Implement caching (Redis)
- Add rate limiting
- Database query optimization
- Add request logging

## Deployment

### Prepare for Production
1. Update `.env` with production values
2. Change `JWT_SECRET` to a strong random string
3. Update MongoDB connection to production database
4. Set `PORT` if needed
5. Ensure CORS settings are secure

### Deploy on Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set MONGO_URI=<your-production-uri>
heroku config:set JWT_SECRET=<strong-random-secret>

# Deploy
git push heroku main
```

### Deploy on AWS/GCP/Azure
Follow platform-specific deployment guides using the same environment variables.

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT

## Support

For questions or issues:
1. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Review [CODE_REVIEW.md](CODE_REVIEW.md)
3. Check Swagger UI at `/api-docs`
4. Review error messages in responses

## Version History

### 1.0.0 (Current)
- ✅ User authentication (register, login)
- ✅ Task management (CRUD)
- ✅ Admin capabilities
- ✅ JWT authentication
- ✅ Input validation with Zod
- ✅ Swagger documentation
- ✅ Comprehensive error handling
- ✅ Role-based access control

---

**Last Updated**: February 6, 2024
**Status**: ✅ Production Ready
**API Version**: v1
