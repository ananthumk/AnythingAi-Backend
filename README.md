# Task Management Application

A full-stack task management system with user authentication, role-based access control, and interactive UI. Built with **Node.js/Express** backend, **React** frontend, **MongoDB** database, and **JWT** authentication.

## 📋 Features

### Backend Features
✅ **User Authentication** - Registration, login with JWT tokens
✅ **Task Management** - Complete CRUD operations with pagination
✅ **Search & Filter** - Filter by status, priority; search by title/description  
✅ **Role-Based Access** - User and Admin roles with different permissions
✅ **Input Validation** - Zod schema validation
✅ **Error Handling** - Standardized error responses
✅ **API Documentation** - Swagger UI and markdown docs

### Frontend Features
✅ **Responsive UI** - Mobile-first design with Tailwind CSS
✅ **Modal Popups** - Task creation and editing without page navigation
✅ **Real-time Filters** - Search, status, and priority filters with instant results
✅ **Pagination** - Navigate through tasks with prev/next controls
✅ **Toast Notifications** - User feedback for actions
✅ **Protected Routes** - Login required to access dashboards
✅ **Role-Based UI** - Different views for users and admins
✅ **Loading States** - Spinner during data fetch, "No tasks" message when empty

---

## 🏗️ Project Structure

```
Anything Ai/
├── backend/
│   ├── frontend/                    # React frontend application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── EditTask.jsx     # Edit task modal
│   │   │   │   ├── Task.jsx         # Create task modal
│   │   │   │   ├── TaskCard.jsx     # Task card for users
│   │   │   │   ├── AdminTaskCard.jsx # Task card for admins
│   │   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   │   └── ProtectedRoute.jsx # Route guard
│   │   │   ├── context/
│   │   │   │   └── AppContext.jsx   # Global state (url, token)
│   │   │   ├── pages/
│   │   │   │   ├── LoginForm.jsx    # Login & register page
│   │   │   │   ├── UserDashboard.jsx # User's task view
│   │   │   │   ├── AdminDashboard.jsx # Admin's task view
│   │   │   │   └── NotFound.jsx     # 404 page
│   │   │   ├── App.jsx              # Root component with routes
│   │   │   ├── main.jsx             # Entry point
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── eslint.config.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── swagger.js           # Swagger API docs
│   │   ├── controllers/
│   │   │   ├── userController.js    # Auth endpoints
│   │   │   └── taskController.js    # Task endpoints
│   │   ├── middlleware/
│   │   │   └── authMiddleware.js    # JWT & role validation
│   │   ├── modal/
│   │   │   ├── user.js              # User schema
│   │   │   └── tasks.js             # Task schema
│   │   ├── routes/
│   │   │   ├── userRoutes.js        # Auth routes
│   │   │   └── taskRoutes.js        # Task routes
│   │   └── validators/
│   │       ├── validate.js          # Validation middleware
│   │       ├── authvalidators.js    # Auth schemas
│   │       └── taskValidator.js     # Task schemas
│   │
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   ├── .env
│   ├── API_DOCUMENTATION.md
│   ├── QUICK_REFERENCE.md
│   ├── README.md                    # This file
│   ├── TESTING_GUIDE.md
│   └── CODE_REVIEW.md
```

---

## 🛠️ Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **Validation** | Zod |
| **Documentation** | Swagger/OpenAPI |
| **Environment** | dotenv |

### Frontend
| Component | Technology |
|-----------|-----------|
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS |
| **State Management** | Context API |
| **UI Components** | React Icons |
| **Notifications** | React Toastify |
| **Loading Spinner** | React Loader Spinner |
| **JWT Decoding** | jwt-decode |
| **Linting** | ESLint |

---

## 📦 Prerequisites

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **MongoDB** (Cloud Atlas or Local)
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Anything\ Ai/backend
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create `.env` in the backend root:
```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

#### Start Backend Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure API URL
Update `src/context/AppContext.jsx` if backend URL is different:
```jsx
const url = "http://localhost:5000/api/v1"  // Change if needed
```

#### Start Frontend Server
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend runs at `http://localhost:5173`

---

## 📱 Application Flow

### Authentication Flow
```
1. User opens app → LoginForm page
2. User enters email & password → POST /auth/login
3. Backend returns JWT token
4. Token stored in AppContext
5. Redirect to dashboard (User or Admin based on role)
```

### Task Management Flow
```
User Dashboard:
1. Fetch user's tasks → GET /task?filters
2. Display in grid with TaskCard components
3. Click "+" button → Open Task modal
4. Fill form → POST /task → Refresh list
5. Click task → Open EditTask modal
6. Update → PATCH /tasks/{id} → Refresh list
7. Delete → DELETE /task/{id} → Remove from list

Admin Dashboard:
1. Fetch all tasks → GET /task/admin/tasks?filters
2. Display with user info using AdminTaskCard
3. Can delete any task → DELETE /task/admin/tasks/{id}
4. Same create/edit flow as user
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register     - Create new user
POST   /api/v1/auth/login        - Login user, return JWT token
```

### User Tasks
```
POST   /api/v1/task               - Create task (user only)
GET    /api/v1/task               - Get own tasks with filters & pagination
GET    /api/v1/task/{id}          - Get task by ID
PATCH  /api/v1/tasks/{id}         - Update own task
DELETE /api/v1/task/{id}          - Delete own task
```

### Admin Tasks
```
GET    /api/v1/task/admin/tasks   - Get all tasks (admin only) with filters
DELETE /api/v1/task/admin/tasks/{id} - Delete any task (admin only)
```

---

## 🔍 Frontend Components Overview

### Pages
- **LoginForm.jsx** - Registration and login, handles auth
- **UserDashboard.jsx** - Regular user's task list with filters
- **AdminDashboard.jsx** - Admin view of all tasks
- **NotFound.jsx** - 404 page for invalid routes

### Components
- **Task.jsx** - Modal for creating new tasks
- **EditTask.jsx** - Modal for editing existing tasks
- **TaskCard.jsx** - Task display card for users (with edit/delete)
- **AdminTaskCard.jsx** - Task display card for admins
- **Navbar.jsx** - Top navigation with user info and logout
- **ProtectedRoute.jsx** - Guards routes requiring authentication

### Context
- **AppContext.jsx** - Stores API base URL and JWT token globally

---

## 📊 Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### Task Schema
```javascript
{
  _id: ObjectId,
  title: String (required, min 3 chars),
  description: String (optional),
  status: String (enum: ['pending', 'in progress', 'completed']),
  priority: String (enum: ['low', 'medium', 'high']),
  createdBy: ObjectId (reference to User),
  dueDate: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Security

### Frontend Authentication
1. User logs in → Token received from backend
2. Token stored in `AppContext`
3. Token included in all API requests: `Authorization: Bearer <token>`
4. Token decoded to extract user role using `jwt-decode`
5. Protected routes check if token exists
6. On logout → Token cleared from context

### Backend Authentication
1. `authMiddleware.js` verifies JWT on every protected route
2. Extracts `userId` and `role` from token
3. Available as `req.user` in controllers
4. Unauthorized requests return 401
5. Insufficient permissions return 403

### Password Security
- Passwords hashed with bcryptjs (10 rounds)
- Plaintext password never stored or returned
- JWT tokens expire after 7 days

---

## 🎨 Frontend Features Explained

### Empty State Handling
- **Loading**: Shows spinner while fetching tasks
- **No Tasks**: Displays friendly message with "Create Task" button
- **With Tasks**: Shows task grid with cards

### Filters & Search
- **Status Filter**: pending, in progress, completed
- **Priority Filter**: low, medium, high
- **Search**: Finds tasks by title or description (case-insensitive)
- **Pagination**: 6 tasks per page with prev/next navigation

### Modal Popups
- **Create Task**: Opens overlay, fills form, submits
- **Edit Task**: Pre-fills current values, updates on submit
- Both close on success or by clicking X button
- Form validation prevents empty title submission

### Toast Notifications
- Success messages when task created/updated/deleted
- Error messages from API displayed to user
- Auto-dismiss after 3 seconds

### Role-Based UI
- **User**: Only sees own tasks, delete endpoint is `/task/{id}`
- **Admin**: Sees all tasks with creator info, delete endpoint is `/task/admin/tasks/{id}`
- Different TaskCard components for each role

---

## 📝 Query Parameters

### Task List Endpoints
```
GET /task or /task/admin/tasks?status=open&priority=high&search=important&page=2

Parameters:
- status: pending, in progress, completed (optional)
- priority: low, medium, high (optional)
- search: text search in title/description (optional)
- page: page number (default 1, limit 6 per page)
```

---

## ⚠️ Important Notes

### Status Values in Code
- **Frontend** filter shows: `pending`, `in progress`, `completed`
- **Backend** stores/expects: These same values should be consistent
- Always verify status values match between create and filter

### User Field in Task
- Backend stores tasks with `createdBy` field (not `user`)
- Admin endpoint lookups use `createdBy` for user join
- User endpoint uses `createdBy` filter in `getAllTask`

### Role Field Reference
- Tasks don't directly store role information
- User's role is in JWT token, decoded on frontend using `jwt-decode`
- Used to determine which delete endpoint to call

---

## 🧪 Testing the Application

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq .
```

### Test Get Tasks
Replace `<token>` with actual token:
```bash
curl -X GET "http://localhost:5000/api/v1/task?page=1&status=pending" \
  -H "Authorization: Bearer <token>"
```

For full testing guide, see [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🐛 Common Issues & Solutions

### Frontend Issues

**Token not persisting after page refresh**
- AppContext is cleared on page reload
- Add localStorage to persist token (future enhancement)

**API calls failing with 404**
- Check backend is running on correct port
- Verify URL in AppContext matches backend endpoint
- Check network tab in DevTools

**Tasks not showing up**
- Ensure logged in user
- Check network request returned tasks array
- Verify JWT token is valid

### Backend Issues

**MongoDB Connection Error**
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist
- Ensure database credentials are correct

**Token Expired (401)**
- User needs to login again
- Tokens expire after 7 days

**Validation Errors (400)**
- Check required fields are provided
- Title must be minimum 3 characters
- Email must be valid format

---

## 📚 Additional Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with examples

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables
heroku config:set MONGO_URI=<production-url>
heroku config:set JWT_SECRET=<strong-random-key>

git push heroku main
```

---

## 📈 Future Enhancements

- [ ] Add localStorage for token persistence
- [ ] Implement task due date with reminders
- [ ] Add task categories/tags
- [ ] Implement real-time updates with WebSockets
- [ ] Add email notifications
- [ ] Implement user profile page
- [ ] Add dark mode
- [ ] Implement advanced filtering (date range, assignee)
- [ ] Add task templates
- [ ] Implement automation rules

---

## 📄 License

MIT

---

## ✍️ Version History

### 1.2.0 (Current)
- ✅ Full frontend implementation with React
- ✅ Popup modals for create/edit tasks
- ✅ User dashboard with filters and pagination
- ✅ Admin dashboard with all tasks view
- ✅ Role-based delete endpoints
- ✅ Empty state UI
- ✅ Axios for all API calls
- ✅ Toast notifications

### 1.1.0
- ✅ Backend pagination and filtering
- ✅ Search functionality
- ✅ Admin task management

### 1.0.0
- ✅ User authentication (register/login)
- ✅ Task CRUD operations
- ✅ JWT authentication
- ✅ Role-based access control

---

**Last Updated**: February 7, 2026  
**Status**: ✅ Production Ready  
**Stack**: MERN (MongoDB, Express, React, Node.js)
