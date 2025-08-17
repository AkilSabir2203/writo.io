# Document Editor with JWT Authentication

A modern document editor web application with JWT-based user authentication, featuring AI-powered text improvement tools.

## Features

### Authentication
- **User Registration**: Create new accounts with email and password
- **User Login**: Secure login with JWT token generation
- **User Logout**: Complete session termination
- **Protected Routes**: All editor and AI features require authentication
- **Auto-logout**: Automatic redirect to login on token expiration

### Document Editor
- Rich text editing interface
- Auto-save functionality (saves 2 seconds after user stops typing)
- Manual save with Ctrl+S
- User-specific document storage
- Dark/light theme toggle

### AI Features (Authenticated)
- Text improvement (grammar, clarity, professional, casual)
- Text translation
- Text analysis and explanation
- Text summarization

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gemini AI API key

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/documenteditor
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. **Start the application**:
   ```bash
   # Start the backend server
   node backend/server.js
   
   # Serve the frontend (you can use any static file server)
   # For example, with Python:
   cd frontend && python -m http.server 8000
   
   # Or with Node.js http-server:
   npx http-server frontend -p 8000
   ```

4. **Access the application**:
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:3000

## Usage

### Authentication Flow

1. **Registration**: 
   - Navigate to `register.html` or click "Sign Up" from login page
   - Fill in full name, email, password, and confirm password
   - Upon successful registration, you'll be automatically logged in and redirected to the editor

2. **Login**:
   - Navigate to `index.html` (login page)
   - Enter your email and password
   - Upon successful login, you'll be redirected to the editor with a JWT token

3. **Using the Editor**:
   - Your email will be displayed in the top-right corner
   - The editor auto-saves your document every 2 seconds after you stop typing
   - Use Ctrl+S for manual save
   - All AI features are available once authenticated

4. **Logout**:
   - Click the "Logout" button in the editor header
   - Confirm the logout action
   - You'll be redirected to the login page and all tokens will be cleared

### API Endpoints

#### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout (requires authentication)
- `GET /verify-token` - Verify JWT token validity

#### Document Management
- `POST /note` - Save user's document (requires authentication)
- `GET /note` - Load user's document (requires authentication)

#### AI Features (all require authentication)
- `POST /ai/improve` - Improve text with various options
- `POST /ai/translate` - Translate text to different languages
- `POST /ai/explain` - Analyze and explain text

### Security Features

- **JWT Tokens**: 24-hour expiration time
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: All sensitive operations require valid JWT
- **Automatic Token Validation**: Frontend automatically handles token expiration
- **Secure Headers**: Authorization header with Bearer token format

### Token Management

The frontend automatically handles:
- Token storage in localStorage
- Adding Authorization headers to API requests
- Token expiration detection and automatic logout
- Redirecting unauthenticated users to login

### Error Handling

The application includes comprehensive error handling for:
- Invalid credentials
- Expired tokens
- Network errors
- Server errors
- Validation errors

## File Structure

```
├── backend/
│   ├── models/
│   │   └── User.js          # User model schema
│   └── server.js            # Express server with JWT auth
├── frontend/
│   ├── index.html           # Login page
│   ├── register.html        # Registration page
│   ├── editor.html          # Main editor interface
│   ├── script.js            # Authentication functions
│   └── editor.js            # Editor functionality
├── package.json
├── .env.example             # Environment variables template
└── README.md
```

## Development Notes

- The JWT secret should be a strong, random string in production
- Consider implementing refresh tokens for enhanced security
- Add rate limiting for authentication endpoints in production
- Implement password reset functionality for better user experience
- Consider adding email verification for new registrations

## Troubleshooting

### Common Issues

1. **"Access token required" error**:
   - Check if you're logged in
   - Clear browser storage and log in again

2. **MongoDB connection issues**:
   - Ensure MongoDB is running
   - Check the MONGO_URI in your .env file

3. **AI features not working**:
   - Verify your GEMINI_API_KEY is valid
   - Check if you're authenticated

4. **CORS errors**:
   - Ensure the frontend and backend are running on the correct ports
   - Check that the API_URL in script.js matches your backend URL