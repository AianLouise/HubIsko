# HubIsko - Scholarship Management System

HubIsko is a comprehensive MERN stack application designed to connect scholarship providers with potential scholars. The platform streamlines the scholarship application process, manages applications, and fosters a community through forums and announcements.

## Features

- **User Authentication System**: Secure login/registration with email verification
- **Role-Based Access**: Different interfaces for applicants, scholars, providers, and administrators
- **Scholarship Management**: Create, update, and manage scholarship programs
- **Application Processing**: Submit, review, and track scholarship applications
- **Forums**: Community discussion boards for scholarship-related topics
- **Notifications**: Real-time notifications for application updates and announcements
- **Profile Management**: Comprehensive user profiles for applicants and providers
- **Administrative Dashboard**: Manage users, applications, and site content
- **Activity Logging**: Track user actions and application progress

## Technology Stack

### Backend
- **Node.js & Express**: Server-side framework
- **MongoDB**: Database for storing application data
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication and authorization
- **Bcrypt**: Password hashing
- **Nodemailer**: Email notifications

### Frontend
- **React**: UI library
- **Redux & Redux Toolkit**: State management
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **Firebase**: File storage
- **Chart.js**: Data visualization
- **React CSV**: Export functionality

## Project Structure

```
/api                  # Backend code
  /controllers        # API endpoint handlers
  /models             # Database schemas
  /routes             # API routes
  /utils              # Helper utilities
  index.js            # Server entry point

/client               # Frontend code
  /public             # Static assets
  /src
    /assets           # Images and icons
    /components       # Reusable UI components
    /hooks            # Custom React hooks
    /pages            # Application pages
    /redux            # Redux store setup and slices
    App.jsx           # Main application component
    main.jsx          # Entry point
```

## Installation and Setup

### Prerequisites
- Node.js (v14.x or later)
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
```

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/AianLouise/HubIsko.git
cd HubIsko
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

#### Production Mode

1. Build the client:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## User Roles and Access

1. **Applicant/Scholar**
   - Register and complete profile
   - Browse and apply for scholarships
   - Track application status
   - Participate in forums
   - Receive notifications

2. **Provider**
   - Create and manage scholarship programs
   - Review applications
   - Select scholars
   - Post announcements
   - Manage scholar records

3. **Administrator**
   - Manage all users and content
   - Review and approve provider accounts
   - Moderate forums
   - Access system-wide analytics
   - Configure system settings

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Log in an existing user
- `GET /api/auth/signout`: Log out current user
- `POST /api/auth/verify-email`: Verify user email

### User Endpoints

- `GET /api/user/:id`: Get user information
- `POST /api/user/update/:id`: Update user profile
- `DELETE /api/user/delete/:id`: Delete user account

### Scholarship Endpoints

- `GET /api/scholarshipProgram`: Get all scholarships
- `POST /api/scholarshipProgram/create`: Create a new scholarship
- `GET /api/scholarshipProgram/:id`: Get scholarship details
- `PUT /api/scholarshipProgram/update/:id`: Update scholarship
- `DELETE /api/scholarshipProgram/delete/:id`: Delete scholarship

### Application Endpoints

- `POST /api/scholarshipApplication/submit`: Submit a new application
- `GET /api/scholarshipApplication/user/:userId`: Get user's applications
- `GET /api/scholarshipApplication/program/:programId`: Get program's applications
- `PUT /api/scholarshipApplication/update/:id`: Update application status

### Forum Endpoints

- `GET /api/forum/posts`: Get all forum posts
- `POST /api/forum/post/create`: Create a new forum post
- `GET /api/forum/post/:id`: Get post details
- `POST /api/forum/comment/create`: Add a comment to a post

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux](https://redux.js.org/)
- [Vite](https://vitejs.dev/)
