# EvolSoft Backend API

A robust Node.js/Express backend API for managing electric vehicle charging stations with user authentication and comprehensive filtering capabilities.

## 🚀 Features

- **User Authentication**: JWT-based authentication system
- **Charging Station Management**: Full CRUD operations for charging stations
- **Advanced Filtering**: Filter stations by status, power output, connector type, location, and name
- **Geolocation Support**: Store and query charging station coordinates
- **Data Validation**: Comprehensive input validation and error handling
- **MongoDB Integration**: Mongoose ODM for database operations

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: dotenv for configuration
- **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd evoltsoft/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── charger.js       # Charging station endpoints
│   └── user.js          # User authentication endpoints
├── db/
│   └── db.js            # MongoDB connection
├── lib/
│   ├── error.js         # Custom error classes
│   └── token.js         # JWT utilities
├── middleware/
│   └── authMiddleware.js # Authentication middleware
├── models/
│   ├── charger.js       # Charging station schema
│   └── user.js          # User schema
├── routes/
│   ├── charger.js       # Charging station routes
│   └── user.js          # User routes
├── services/
│   ├── charger.js       # Business logic for chargers
│   └── user.js          # Business logic for users
├── server.js            # Application entry point
└── .env                 # Environment variables
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/user/register` | Register new user |
| POST   | `/api/user/login`    | User login        |

### Charging Stations

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/charger`     | Get all charging stations   |
| GET    | `/api/charger/:id` | Get charging station by ID  |
| POST   | `/api/charger`     | Create new charging station |
| PUT    | `/api/charger/:id` | Update charging station     |
| DELETE | `/api/charger/:id` | Delete charging station     |

### Query Parameters for GET `/api/charger`

- `status` - Filter by status (Active, Inactive)
- `powerOutput` - Filter by power output (kW)
- `connectorType` - Filter by connector type
- `location` - Filter by location
- `sort` - Sort by creation date (newest, oldest)
- `name` - Search by station name (case-insensitive)

**Example:**

```
GET /api/charger?status=Active&powerOutput=50&sort=newest&name=tesla
```

## 📊 Data Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (optional),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Charging Station Model

```javascript
{
  name: String (required),
  location: {
    latitude: Number (required),
    longitude: Number (required)
  },
  status: String (required, enum: ['Active', 'Inactive']),
  powerOutput: Number (required),
  connectorType: String (required, enum: [
    'Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla Supercharger'
  ]),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Protected endpoints require valid authentication tokens.

## 📝 Request/Response Examples

### Create Charging Station

```bash
POST /api/charger
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Tesla Supercharger Station",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "status": "Active",
  "powerOutput": 150,
  "connectorType": "Tesla Supercharger"
}
```

### Response

```json
{
  "_id": "60d5ec49f1b2c8a1234567890",
  "name": "Tesla Supercharger Station",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "status": "Active",
  "powerOutput": 150,
  "connectorType": "Tesla Supercharger",
  "createdAt": "2024-06-01T10:30:00.000Z",
  "updatedAt": "2024-06-01T10:30:00.000Z"
}
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Environment Variables

| Variable      | Description               | Default     |
| ------------- | ------------------------- | ----------- |
| `PORT`        | Server port               | 3000        |
| `MONGODB_URI` | MongoDB connection string | -           |
| `JWT_SECRET`  | JWT signing secret        | -           |
| `NODE_ENV`    | Environment mode          | development |
