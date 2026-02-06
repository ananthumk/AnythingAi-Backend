# API Testing Guide

This guide shows how to test all endpoints of the Task Management API using various tools.

## Testing Tools

- **Swagger UI** (Browser-based) - Recommended for beginners
- **Postman** (Desktop/Web app) - Recommended for production testing
- **cURL** (Command line) - Recommended for automation
- **Thunder Client** (VS Code extension) - Lightweight alternative

---

## Method 1: Swagger UI (Easiest)

### Steps

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI**
   - Navigate to: `http://localhost:5000/api-docs`

3. **Test endpoints**
   - Click on any endpoint to expand
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - See response below

### Testing Flow

1. **Register User**
   - Open `/auth/register` endpoint
   - Click "Try it out"
   - Fill example:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "secure123456"
     }
     ```
   - Execute

2. **Login User**
   - Open `/auth/login` endpoint
   - Fill example:
     ```json
     {
       "email": "test@example.com",
       "password": "secure123456"
     }
     ```
   - Execute
   - **Copy the token from response**

3. **Create Task**
   - Open `/task` POST endpoint
   - Click "Try it out"
   - Authorize: Click "Authorize" yellow button at top
     - Paste token in format: `Bearer <your-token>`
     - Click "Authorize"
   - Send request:
     ```json
     {
       "title": "Complete project",
       "description": "Finish API development",
       "priority": "high"
     }
     ```
   - Execute

4. **Get All Tasks**
   - Open `GET /task` endpoint
   - Authorize with token (if not already done)
   - Click "Execute"

5. **Get Specific Task**
   - Open `GET /task/{id}` endpoint
   - Replace `{id}` with actual task ID from previous response
   - Execute

6. **Update Task**
   - Open `PATCH /task/{id}` endpoint
   - Fill task ID
   - Update body:
     ```json
     {
       "status": "in progress",
       "priority": "medium"
     }
     ```
   - Execute

7. **Delete Task**
   - Open `DELETE /task/{id}` endpoint
   - Fill task ID
   - Execute

---

## Method 2: Postman (Professional Testing)

### Installation
1. Download from [postman.com](https://www.postman.com)
2. Create free account
3. Open application

### Setup

1. **Create Collection**
   - Click "New" → "Collection"
   - Name: "Task Management API"

2. **Create Environment**
   - Click "Environments" → "+"
   - Name: "Local Development"
   - Variables:
     ```
     base_url: http://localhost:5000/api/v1
     token: (empty - will fill after login)
     ```

### Testing Requests

#### 1. Register
```
Method: POST
URL: {{base_url}}/auth/register
Headers:
  Content-Type: application/json
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "secure123456"
}
```

#### 2. Login
```
Method: POST
URL: {{base_url}}/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "test@example.com",
  "password": "secure123456"
}
```

**After executing**, extract token:
- Open "Tests" tab (bottom)
- Add:
  ```javascript
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
  ```
- This automatically saves token for future requests

#### 3. Create Task
```
Method: POST
URL: {{base_url}}/task
Headers:
  Content-Type: application/json
  Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "Complete project",
  "description": "Finish API development",
  "priority": "high"
}
```

#### 4. Get All Tasks
```
Method: GET
URL: {{base_url}}/task
Headers:
  Authorization: Bearer {{token}}
```

#### 5. Get Task by ID
```
Method: GET
URL: {{base_url}}/task/<task_id>
Headers:
  Authorization: Bearer {{token}}
```

#### 6. Update Task
```
Method: PATCH
URL: {{base_url}}/task/<task_id>
Headers:
  Content-Type: application/json
  Authorization: Bearer {{token}}
Body (JSON):
{
  "status": "in progress",
  "priority": "medium"
}
```

#### 7. Delete Task
```
Method: DELETE
URL: {{base_url}}/task/<task_id>
Headers:
  Authorization: Bearer {{token}}
```

#### 8. Admin - Get All Tasks
```
Method: GET
URL: {{base_url}}/admin/tasks
Headers:
  Authorization: Bearer {{admin_token}}
```
(Note: Need admin user for this)

#### 9. Admin - Delete Task
```
Method: DELETE
URL: {{base_url}}/admin/tasks/<task_id>
Headers:
  Authorization: Bearer {{admin_token}}
```

---

## Method 3: cURL (Command Line)

### Basic Syntax
```bash
curl -X <METHOD> <URL> \
  -H "Header: value" \
  -d '{"key": "value"}'
```

### Complete Testing Script

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api/v1"

echo -e "${BLUE}=== Task Management API Testing ===${NC}\n"

# 1. Register User
echo -e "${BLUE}1. Registering User...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "secure123456"
  }')
echo $REGISTER_RESPONSE | jq '.'

# 2. Login
echo -e "\n${BLUE}2. Logging In...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "secure123456"
  }')
echo $LOGIN_RESPONSE | jq '.'

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo -e "${GREEN}Token saved: ${TOKEN:0:20}...${NC}\n"

# 3. Create Task
echo -e "${BLUE}3. Creating Task...${NC}"
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/task \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish API development",
    "priority": "high"
  }')
echo $CREATE_RESPONSE | jq '.'

# Extract task ID
TASK_ID=$(echo $CREATE_RESPONSE | jq -r '.data._id')
echo -e "${GREEN}Task created: ${TASK_ID}${NC}\n"

# 4. Get All Tasks
echo -e "${BLUE}4. Getting All Tasks...${NC}"
curl -s -X GET $BASE_URL/task \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 5. Get Specific Task
echo -e "\n${BLUE}5. Getting Specific Task...${NC}"
curl -s -X GET $BASE_URL/task/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. Update Task
echo -e "\n${BLUE}6. Updating Task...${NC}"
curl -s -X PATCH $BASE_URL/task/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in progress",
    "priority": "medium"
  }' | jq '.'

# 7. Delete Task
echo -e "\n${BLUE}7. Deleting Task...${NC}"
curl -s -X DELETE $BASE_URL/task/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n${GREEN}=== Testing Complete ===${NC}"
```

### Save as Script
1. Create file: `test-api.sh`
2. Paste above code
3. Make executable:
   ```bash
   chmod +x test-api.sh
   ```
4. Run:
   ```bash
   ./test-api.sh
   ```

### Individual cURL Commands

#### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "secure123456"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "secure123456"
  }'
```

#### Create Task
```bash
curl -X POST http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish API",
    "priority": "high"
  }'
```

#### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Task by ID
```bash
curl -X GET http://localhost:5000/api/v1/task/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Update Task
```bash
curl -X PATCH http://localhost:5000/api/v1/task/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in progress"
  }'
```

#### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/v1/task/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Admin - Get All Tasks
```bash
curl -X GET http://localhost:5000/api/v1/admin/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

#### Admin - Delete Task
```bash
curl -X DELETE http://localhost:5000/api/v1/admin/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

## Test Cases Checklist

### Authentication Tests
- [ ] Register user with valid data
- [ ] Register fails with duplicate email
- [ ] Register fails with invalid email
- [ ] Register fails with short password (<8 chars)
- [ ] Register fails with short name (<3 chars)
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent user
- [ ] Request without token returns 401
- [ ] Invalid token returns 401

### Task Tests (User)
- [ ] Create task with all fields
- [ ] Create task with required fields only
- [ ] Create task fails with short title
- [ ] Get all tasks returns user's tasks only
- [ ] Get specific task succeeds
- [ ] Get specific task fails with non-existent ID
- [ ] Get task by another user fails (403)
- [ ] Update own task succeeds
- [ ] Update fails with invalid status
- [ ] Update fails with invalid priority
- [ ] Delete own task succeeds
- [ ] Delete task by another user fails (403)

### Admin Tests
- [ ] Admin can view all tasks
- [ ] Admin can delete any task
- [ ] Non-admin cannot access admin routes (403)

### Error Tests
- [ ] Missing field returns 400
- [ ] Invalid enum value returns 400
- [ ] Malformed JSON returns 400
- [ ] Server errors return 500

---

## Performance Testing

### Load Testing Script
```bash
# Install Apache Bench
brew install httpd  # macOS
# or apt-get install apache2-utils  # Linux

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Debugging Tips

### Check Variables
```bash
# View token
echo $TOKEN

# View task ID
echo $TASK_ID
```

### Parse JSON Response
```bash
# Extract specific field
curl ... | jq '.data._id'

# Pretty print
curl ... | jq '.'
```

### View Request Headers Sent
```bash
curl -v http://localhost:5000/api/v1/task
```

### Monitor Database
```bash
# In MongoDB shell
db.users.find()
db.tasks.find()
```

---

## Common Test Scenarios

### Scenario 1: User Creates and Manages Tasks
1. Register
2. Login
3. Create 3 tasks with different priorities
4. Update one task status
5. Delete one task
6. Verify remaining tasks

### Scenario 2: Multiple Users
1. Register user A
2. Register user B
3. User A creates task
4. User B tries to view user A's task (should fail)
5. User B creates own task
6. Verify isolation

### Scenario 3: Admin Capabilities
1. Create admin user (in database directly or registration)
2. Admin gets all tasks from all users
3. Admin deletes any task
4. Verify task deleted

---

## Expected Responses Reference

### Success Responses
- **200 OK** - GET, PATCH, DELETE (successful)
- **201 Created** - POST (successful creation)

### Error Responses
- **400 Bad Request** - Validation errors
  ```json
  {
    "message": "validation failed",
    "errors": ["Invalid email format"]
  }
  ```

- **401 Unauthorized** - Missing or invalid token
  ```json
  {
    "message": "Invalid Token"
  }
  ```

- **403 Forbidden** - Not authorized for action
  ```json
  {
    "message": "Access Denied"
  }
  ```

- **404 Not Found** - Resource doesn't exist
  ```json
  {
    "message": "Task not found"
  }
  ```

- **500 Server Error**
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

---

## Tips for Testing

1. **Save Tokens**: Keep tokens to avoid repeated login
2. **Use Variables**: Store base URL, token in environment
3. **Test Errors**: Don't just test happy path
4. **Check Headers**: Verify correct Content-Type
5. **Monitor Logs**: Check server console for errors
6. **Clear Data**: Delete test data between test runs

---

## Next Steps

After testing all endpoints:
1. ✅ Run full test suite
2. ✅ Check error handling
3. ✅ Verify role-based access
4. ✅ Test with invalid data
5. ✅ Deploy to production

---

**Last Updated**: February 6, 2024
**API Version**: 1.0.0
