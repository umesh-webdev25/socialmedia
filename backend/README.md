# Mini Social Media Platform — Backend API

> MERN Stack Backend  ·  Node.js · Express · MongoDB/Mongoose · JWT · bcryptjs · Yup

---

## Quick Start

```bash
cd backend
cp .env.example .env        # Fill in your MONGO_URI and JWT_SECRET
npm install
npm run dev                 # Starts with nodemon on http://localhost:5000
```

---

## Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, GetMe
│   ├── userController.js      # GetProfile, UpdateProfile
│   └── postController.js      # Create, GetAll, GetOwn, Delete
├── helpers/
│   └── errorHandler.js        # Global error handler + createError()
├── middleware/
│   ├── authMiddleware.js      # JWT protect + restrictTo guards
│   └── validateMiddleware.js  # Yup schema validation middleware
├── models/
│   ├── User.js                # Mongoose User schema (bcrypt pre-save hook)
│   └── Post.js                # Mongoose Post schema (auto-populate user)
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   ├── userRoutes.js          # /api/users/*
│   └── postRoutes.js          # /api/posts/*
├── services/
│   ├── authService.js         # Register & login business logic
│   ├── userService.js         # Profile get & update logic
│   └── postService.js         # Post CRUD logic with ownership check
├── utils/
│   ├── bcryptUtils.js         # hashPassword, comparePassword
│   ├── helpers.js             # isValidObjectId, sanitizeUser, asyncWrapper
│   ├── jwtUtils.js            # generateToken, verifyToken, decodeToken
│   └── responseUtils.js       # successResponse, errorResponse, paginatedResponse
├── validations/
│   ├── authValidation.js      # registerSchema, loginSchema (Yup)
│   ├── postValidation.js      # createPostSchema (Yup)
│   └── userValidation.js      # updateProfileSchema (Yup)
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## Environment Variables (`.env`)

| Variable            | Default                                         | Description                 |
|---------------------|-------------------------------------------------|-----------------------------|
| `PORT`              | `5000`                                          | Server port                 |
| `NODE_ENV`          | `development`                                   | Environment                 |
| `MONGO_URI`         | `mongodb://localhost:27017/socialmedia`          | MongoDB connection string   |
| `JWT_SECRET`        | —                                               | **Required** — sign JWTs    |
| `JWT_EXPIRES_IN`    | `7d`                                            | Token lifetime              |
| `CLIENT_ORIGIN`     | `http://localhost:5173`                         | CORS allowed origin         |
| `BCRYPT_SALT_ROUNDS`| `12`                                            | bcrypt cost factor          |

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

---

### Auth Routes (`/api/auth`)

#### `POST /api/auth/register` — Public
Register a new account.

**Body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Validation (Yup)**
- `name` — min 3 chars, max 50 chars, required
- `email` — valid email format, required
- `password` — min 6 chars, required

**Response `201`**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "bio": "", "profilePicture": "" },
    "token": "<JWT>"
  }
}
```

---

#### `POST /api/auth/login` — Public
Login and receive a JWT.

**Body**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response `200`**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": { "user": { ... }, "token": "<JWT>" }
}
```

---

#### `GET /api/auth/me` — Protected
Returns the currently authenticated user.

**Response `200`**
```json
{ "success": true, "message": "Authenticated user retrieved", "data": { "user": { ... } } }
```

---

### User Profile Routes (`/api/users`)

All routes require authentication.

#### `GET /api/users/profile` — Protected
Returns the logged-in user's profile.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...", "name": "Jane Doe", "email": "jane@example.com",
      "bio": "Hello world", "profilePicture": "https://..."
    }
  }
}
```

---

#### `PATCH /api/users/profile` — Protected
Update profile. **Email is read-only and cannot be changed.**

**Body** (at least one field required)
```json
{ "name": "Jane Smith", "bio": "New bio", "profilePicture": "https://cdn.example.com/pic.png" }
```

**Validation (Yup)**
- `name` — min 3 chars, max 50 chars, optional
- `bio` — max 200 chars, optional
- `profilePicture` — valid URL, optional
- At least one of the three fields must be present

**Response `200`**
```json
{ "success": true, "message": "Profile updated successfully", "data": { "user": { ... } } }
```

---

### Post Routes (`/api/posts`)

All routes require authentication.

#### `POST /api/posts` — Protected
Create a new post (text, image, or both).

**Body** (at least one of `text` or `image` required)
```json
{ "text": "Hello world!", "image": "https://cdn.example.com/img.jpg" }
```

**Response `201`**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "_id": "...", "text": "Hello world!", "image": "...",
      "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" },
      "createdAt": "..."
    }
  }
}
```

---

#### `GET /api/posts` — Protected
Retrieve all posts (newest first) with embedded user info.

**Response `200`**
```json
{ "success": true, "data": { "posts": [ ... ], "count": 42 } }
```

---

#### `GET /api/posts/my` — Protected
Retrieve only posts created by the authenticated user.

**Response `200`**
```json
{ "success": true, "data": { "posts": [ ... ], "count": 5 } }
```

---

#### `DELETE /api/posts/:id` — Protected
Delete a post. **Only the post's owner can delete it.**

**Response `200`**
```json
{ "success": true, "message": "Post deleted successfully", "data": { "post": { ... } } }
```

**Error `403`** — if another user attempts deletion
```json
{ "success": false, "message": "You are not authorized to delete this post" }
```

---

## Error Response Format

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Please enter a valid email address" }
  ]
}
```

| HTTP Code | Meaning                          |
|-----------|----------------------------------|
| 400       | Bad request / invalid ObjectId   |
| 401       | Unauthenticated / invalid token  |
| 403       | Forbidden (wrong owner)          |
| 404       | Resource not found               |
| 409       | Conflict (duplicate email)       |
| 422       | Validation failed (Yup)          |
| 500       | Internal server error            |

---

## Database Models

### User
| Field          | Type   | Notes                              |
|----------------|--------|------------------------------------|
| name           | String | min 3, max 50 chars                |
| email          | String | unique, lowercase                  |
| password       | String | bcrypt hashed, `select: false`     |
| bio            | String | max 200 chars, default ""          |
| profilePicture | String | URL, default ""                    |
| createdAt      | Date   | auto (timestamps)                  |
| updatedAt      | Date   | auto (timestamps)                  |

### Post
| Field     | Type     | Notes                              |
|-----------|----------|------------------------------------|
| text      | String   | max 1000 chars                     |
| image     | String   | URL                                |
| user      | ObjectId | ref: User, auto-populated          |
| createdAt | Date     | auto (timestamps)                  |
| updatedAt | Date     | auto (timestamps)                  |
