# Robotics-Dashboard-Backend
A MERN stack backend for a Real-Time Robotics Telemetry Dashboard.
Implements clean layered architecture (Controller -> Service -> Repository), JWT authentication, robot APIs, WebSocket-based telemetry, and MongoDB Atlas integration.

#Project Structure
src/
 - config/          # DB connection
 - controllers/     # Express controllers (Auth, Robot)
 - middleware/      # JWT middleware, error handling
 - models/          # Mongoose models (User, Robot, Telemetry)
 - repository/      # Data access (UserRepository, RobotRepository)
 - routes/          # Routes (auth.js, robot.js)
 - services/        # Business logic (AuthService, RobotService)
 - scripts/         # DB utilities (seed, listCollections, etc.)
 - app.js           # Express app setup
 - server.js        # Entry point + WebSocket server
   
#Features
- User Authentication (JWT, bcrypt, express-validator)
- Robot APIs (pagination, filtering, config updates)
- WebSocket Telemetry (real-time robot data every 500ms)
- MongoDB Atlas integration
- Security (helmet, cors, rate-limiter)
- Error handling middleware
- Postman collection included

#Tech Stack
- Node.js, Express.js
- MongoDB Atlas + Mongoose
- Socket.IO (real-time telemetry)
- JWT (jsonwebtoken)
- bcrypt for password hashing
- helmet, cors, morgan, express-rate-limit

#Setup
- Clone repo & install dependencies:
git clone <repo-url>
cd robotics-dashboard-backend
npm install

- Configure .env:
PORT=5000
MONGO_USER=surabhi
MONGO_PASS=surNadh_7329@
MONGO_HOST=backenddb.qwxdc.mongodb.net
MONGO_DB=backenddb
JWT_SECRET=8bcb1894db519347271e2ad9d34eb6cee8333fe3fa5ca0e7bc2a696209f16288f25f069f01260d2721bc85e11254165657fe02e444031004fb65eef88ee5568e
JWT_EXPIRES=1h
CORS_ORIGIN=http://localhost:3000

- Run server:
npm start
  
Server runs on:
http://localhost:5000

#REST API Endpoints
- Auth: 
POST /api/auth/register
POST /api/auth/login

- Robots:
GET /api/robots?page=1&limit=10&status=active
PUT /api/robots/:id/config (JWT required)

#Authentication
Add header to all protected requests: Authorization: Bearer <jwt-token>

#WebSocket Integration
WebSocket URL: ws://localhost:5000

#Postman Collection
- File: postman_collection/Robotic Dashboard.postman_collection.json
- Import into Postman Client to test APIs.

#Health & Monitoring
- /healthz → returns DB connection status
- Rate limiter on login to prevent brute force
- Helmet & CORS for API security
- Logs can be forwarded to CloudWatch (optional)

