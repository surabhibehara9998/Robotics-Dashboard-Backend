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

#High-Frequency Data Sink (Task 1.1 – Conceptual Architecture)
Managing raw high-frequency telemetry (e.g., IMU readings at millisecond intervals, camera metadata, or continuous sensor feeds) from 100+ robots cannot be efficiently handled by writing directly into MongoDB. MongoDB is excellent for structured metadata and fleet state, but it is not designed to absorb unbounded streaming workloads at this scale without introducing write bottlenecks and cost inefficiencies.
Instead, I would design the ingestion pipeline around AWS Kinesis Data Streams as the primary data sink.

- Why AWS Kinesis?
  --Massive Ingestion Capacity: Capable of handling millions of events per second with single-digit millisecond latency.
  --Elastic Scalability: Scales horizontally by adding shards, ensuring smooth handling of load spikes (e.g., robots streaming more frequently during mission-critical phases).
  --Durability & Replay: All telemetry is durably persisted for 24 hours (configurable up to 7 days), enabling replay of streams for debugging or reprocessing.
  --Ecosystem Integration: Natively integrates with AWS Lambda, Kinesis Data Firehose, S3, Redshift, and external systems such as MongoDB Atlas — reducing operational complexity.
  
- Data Flow
Robots → Kinesis Data Stream → Lambda (processing, aggregation, filtering) → 
   → Persist summaries to MongoDB Atlas (fleet dashboard)
   → Persist raw streams to S3 (cheap long-term storage) or AWS Timestream (time-series analytics)

- Why not write directly to MongoDB?
  --MongoDB excels at metadata, config, and dashboards, but unbounded high-frequency writes can overwhelm the cluster, drive up costs, and degrade query performance.
  --By introducing Kinesis as a buffer and event backbone, we decouple ingestion from persistence. MongoDB receives only aggregated or curated telemetry suitable for real-time dashboards, while raw data is
  offloaded to time-series or object storage.

- Alternative: AWS Timestream
For workloads where time-series analysis (rolling averages, battery trends, anomaly detection) is the primary use case, AWS Timestream is a strong alternative. It offers:
  --Native time-series functions (windowed aggregates, interpolation).
  --Built-in tiered storage with automatic aging of data (recent data in memory, older data in cost-optimized storage).
  --Zero-maintenance scaling for time-series use cases.
  --In this hybrid approach:
  --Kinesis remains the ingestion backbone.
  --MongoDB Atlas stores fleet metadata, robot configs, and the “last known state.”
  --AWS Timestream or S3 stores raw high-frequency telemetry for historical analysis and ML training pipelines.

#Health & Monitoring
- /healthz → returns DB connection status
- Rate limiter on login to prevent brute force
- Helmet & CORS for API security
- Logs can be forwarded to CloudWatch (optional)
