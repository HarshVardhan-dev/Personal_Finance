### **Authentication**

#### **Login Page**

- **Purpose**: Authenticate users to access their personal finance data securely.
- **File**: src/pages/Login.js
- **Description**:

  - Users can log in using their registered email and password.
  - On successful login, the user is redirected to the dashboard, and a JWT token is stored in localStorage.

#### **Key Features**

- Input validation for email and password.
- Displays error messages for invalid credentials or empty fields.
- Secure API integration using Axios interceptors.
- Protected routes for authenticated users only.

#### **Route**

- **URL**: /login

#### **API Integration**

- **Endpoint**: POST /api/auth/login
- jsonCopy code{ "email": "user@example.com", "password": "securepassword"}
- jsonCopy code{ "success": true, "token": ""}
