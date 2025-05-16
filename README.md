# VidReviewHub

A full-stack application for video review and collaboration between YouTubers and video editors.

## Features

- 🔐 Firebase Authentication
- 📹 Video and thumbnail uploads with Cloudinary
- 👥 Role-based access control (YouTubers and Editors)
- 🔄 Real-time project status updates
- 💬 Feedback system
- �� Responsive design
- 🔒 Secure file handling
- 📊 Project management dashboard

## Tech Stack

### Frontend
- React.js 18
- Firebase (Auth)
- React Router v6
- Axios
- React Toastify
- CSS3 with modern features

### Backend
- Node.js (v18+)
- Express.js
- MongoDB with Mongoose
- Cloudinary
- Firebase Admin SDK
- JWT Authentication

## Project Structure

```
VidReviewHub/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── FileUpload/    # File upload component
│   │   │   ├── ProjectCard/   # Project display component
│   │   │   └── ErrorBoundary/ # Error handling component
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   └── firebase/         # Firebase configuration
│   └── public/               # Static files
│
└── server/                    # Backend Node.js application
    ├── config/               # Configuration files
    │   ├── db.js           # MongoDB configuration
    │   └── cloudinary.js   # Cloudinary configuration
    ├── controllers/         # Route controllers
    ├── middleware/         # Custom middleware
    │   ├── auth.js        # Authentication middleware
    │   └── upload.js      # File upload middleware
    ├── models/            # Mongoose models
    │   ├── User.js       # User model
    │   └── Project.js    # Project model
    └── routes/           # API routes
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase account
- Cloudinary account

### Environment Variables

#### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Server (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
JWT_SECRET=your_jwt_secret
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/VidReviewHub.git
cd VidReviewHub
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables from server/.env
6. Set Node version to 18.x in Render dashboard

### Frontend (Firebase Hosting)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Build the app: `npm run build`
5. Deploy: `firebase deploy`
6. Update client/.env with production API URL

## API Endpoints

### Authentication
- POST /api/users/register - Register new user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile
- PUT /api/users/:id - Update user

### Projects
- GET /api/projects - Get all projects
- POST /api/projects - Create new project
- GET /api/projects/:id - Get project by ID
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project
- PUT /api/projects/:id/status - Update project status

### File Upload
- POST /api/upload - Upload video and thumbnail
- GET /api/upload/:id - Get upload details

## Security Features

- JWT Authentication
- Role-based access control
- Rate limiting
- Secure file uploads
- Environment variable protection
- CORS configuration
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/VidReviewHub 