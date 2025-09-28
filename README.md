## Robotics-Dashboard-Backend
A MERN stack backend for a Real-Time Robotics Telemetry Dashboard. Implements clean layered architecture (Controller -> Service -> Repository), JWT authentication, robot APIs, WebSocket-based telemetry, and MongoDB Atlas integration. This project is fully containerized with Docker and includes a comprehensive automated testing suite.

## Project Structure
src/
├── config/         # DB connection
├── controllers/    # Express controllers (Auth, Robot)
├── middleware/     # JWT middleware, error handling
├── models/         # Mongoose models (User, Robot)
├── repository/     # Data access (UserRepository, RobotRepository)
├── routes/         # API routes (auth.js, robot.js)
├── services/       # Business logic (AuthService, RobotService)
├── test/           # Jest/Supertest automated tests
├── app.js          # Express app setup
└── server.js       # Entry point + WebSocket server
## Features
Clean Architecture: Follows a professional layered architecture (Controller -> Service -> Repository) for separation of concerns and maintainability.

Secure User Authentication: Implements JWT-based authentication with bcrypt for password hashing and express-validator for input validation.

Robust Robot APIs: Provides RESTful endpoints for paginating, filtering, and updating robot configurations.

Real-Time WebSocket Telemetry: Broadcasts live robot data to authenticated clients every 500ms using Socket.IO.

Production-Grade Security: Includes helmet for security headers, cors for resource sharing, and express-rate-limit to prevent brute-force attacks.

Containerized with Docker: Fully containerized for consistent, portable, and scalable deployments.

Automated Testing: A comprehensive test suite using Jest and Supertest ensures application reliability and code quality.

## Tech Stack
Backend: Node.js, Express.js

Database: MongoDB Atlas + Mongoose

Real-Time: Socket.IO

Authentication: JSON Web Token (jsonwebtoken), bcrypt

Testing: Jest, Supertest

Deployment: Docker

Middleware: helmet, cors, morgan, express-rate-limit

## Setup
Clone the repository:

Bash

git clone <your-repo-url>
cd robotics-dashboard-backend
Install dependencies:

Bash

npm install
Configure .env file:
Create a .env file in the root directory and add the following variables:

PORT=5000
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
JWT_SECRET="<your-strong-jwt-secret>"
JWT_EXPIRES=1h
CORS_ORIGIN=http://localhost:5173
Run the server:

Bash

npm start
Server runs on: http://localhost:5000

## Running with Docker
The application is fully containerized for easy and consistent deployment.

Build the Docker image:

Bash

docker build -t robotics-dashboard-backend .
Run the Docker container (using your .env file):

Bash

docker run --env-file .env -p 5000:5000 robotics-dashboard-backend
## Automated Testing
The backend includes a comprehensive testing suite to ensure code quality and reliability.

Framework: Jest is used as the test runner and assertion library.

HTTP Testing: Supertest is used for integration testing of the Express API endpoints.

Coverage:

Unit Tests: Business logic within the service layer is tested in isolation.

Integration Tests: Critical API endpoints (e.g., user registration, login, robot configuration) are tested to ensure the entire request/response cycle works correctly.

How to Run Tests:

Bash

npm test
## REST API Endpoints
Auth:

POST /api/auth/register

POST /api/auth/login

Robots:

GET /api/robots?page=1&limit=10&status=active

PUT /api/robots/:id/config (JWT required)

## Authentication
Add the following header to all protected requests: Authorization: Bearer <your-jwt-token>

## WebSocket Integration
URL: ws://localhost:5000

Authentication: Requires a valid JWT to be passed in the auth object of the Socket.IO handshake for the connection to be accepted.

## Postman Collection
File: postman_collection/Robotic Dashboard.postman_collection.json

Import into your Postman Client to easily test all API endpoints.

## Deployment (AWS)
### Frontend (React)
Build with npm run build → upload the static contents of the dist folder to an S3 bucket → enable static website hosting. Use CloudFront as a CDN for global low-latency delivery and attach a TLS certificate from ACM for HTTPS. Restrict S3 bucket access so that content can only be served via CloudFront using an Origin Access Identity (OAI).

### Backend (Node.js/Express)
Option A – Elastic Beanstalk (Managed): Great for quick deployments with auto-scaling, health checks, and managed load balancing. Best suited for PoC and small-to-mid production workloads. Deploy with the EB CLI (eb init, eb create, eb deploy) and configure environment variables in the EB console.

Option B – ECS Fargate (Containerized, Recommended for Production): Ideal for production with fine-grained scaling and cost control. Build a Docker image → push to ECR → run as an ECS service on Fargate behind an Application Load Balancer (ALB) that is configured for WebSocket sticky sessions. Use AWS Secrets Manager for the Mongo URI and JWT secret.

Option C – EC2 + Nginx + PM2 (Manual): Works but requires manual scaling, patching, and monitoring. Not recommended for production.

## Database
Use MongoDB Atlas and host the cluster in the same AWS region as the backend for low latency.

Configure VPC Peering between your AWS VPC and the MongoDB Atlas VPC for a secure, private network connection.

Alternative: AWS DocumentDB if a native AWS database service is required.

## High-Frequency Data Sink (Task 1.1 – Conceptual Architecture)
Managing raw, high-frequency telemetry from a large fleet of robots is not efficiently handled by writing directly to a general-purpose database like MongoDB. The optimal solution is to use a dedicated stream-processing service as an ingestion buffer. This project proposes an architecture built around AWS Kinesis Data Streams.

### Why AWS Kinesis?
Massive Ingestion Capacity: Handles millions of events per second with low latency.

Elastic Scalability: Scales horizontally by adding shards to handle load spikes.

Durability & Replay: Persists all telemetry for a configurable period, enabling replay for debugging or reprocessing.

Ecosystem Integration: Natively integrates with AWS Lambda, S3, and other services, allowing for decoupled and scalable data processing pipelines.

### Data Flow
Code snippet

graph TD
    A[Robots] -- Telemetry Stream --> B(AWS Kinesis Data Stream);
    B -- Events --> C{AWS Lambda};
    C -- Aggregated State --> D[(MongoDB Atlas)];
    C -- Raw Time-Series Data --> E[(S3 / AWS Timestream)];
    F[Fleet Dashboard] <--> D;
By using Kinesis as a buffer, we decouple ingestion from persistence. MongoDB receives only the curated state needed for the real-time dashboard, while raw data is offloaded to more suitable storage like S3 or a time-series database like AWS Timestream for historical analysis.

## Health & Monitoring
/healthz: A dedicated endpoint that returns the database connection status (200 OK or 503 Service Unavailable).

Rate Limiter: express-rate-limit is applied to the login endpoint to prevent brute-force attacks.

Security Headers: helmet and cors are configured for API security best practices.
