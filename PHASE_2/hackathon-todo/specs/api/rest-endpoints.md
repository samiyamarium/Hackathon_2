# REST API Endpoints
 
## Base URL
- Development: http://localhost:8000
- Production: https://api.example.com
 
## Authentication
All endpoints require JWT token in header:
Authorization: Bearer <token>
 
## Endpoints
 
### GET /api/tasks
List all tasks for authenticated user.
 
Query Parameters:
- status: "all" | "pending" | "completed"
- sort: "created" | "title" | "due_date"
 
Response: Array of Task objects
 
### POST /api/tasks
Create a new task.
 
Request Body:
- title: string (required)
- description: string (optional)
 
Response: Created Task object

### GET /api/tasks/{id}
Get task details for a specific task.

Response: Task object

### PUT /api/tasks/{id}
Update a task.

Request Body:
- title: string (optional)
- description: string (optional)
- completed: boolean (optional)

Response: Updated Task object

### DELETE /api/tasks/{id}
Delete a task.

Response: Message indicating successful deletion

### PATCH /api/tasks/{id}/complete
Toggle completion status of a task.

Response: Updated Task object
