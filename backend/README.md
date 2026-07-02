# Fitcher Backend

A backend API for **Fitcher** — a home services / contractor marketplace platform that connects customers needing home improvement, construction, or repair work with verified contractors. Customers post projects, contractors submit competitive bids, and after completion both parties can leave reviews.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js 5.x |
| Database | MongoDB + Mongoose 9.x |
| Authentication | JWT (access + refresh tokens), bcrypt |
| Validation | Zod |
| Email | Nodemailer (Gmail) |
| File Storage | Cloudinary |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Morgan |

## Project Structure

```
backend/
  src/
    app.js                  # Express app setup (middleware, CORS, routes)
    index.js                # Server entry point
    config/                 # Environment, DB, mail, cloudinary config
    constants/              # Enums for bids, categories, statuses, etc.
    controllers/            # Route handlers
    service/                # Business logic
    Repositories/           # Data access layer (Mongoose queries)
    models/                 # Mongoose schemas
    routes/                 # API route definitions
    middlewares/            # Auth, role, validation, error handling
    validation/             # Zod request schemas
    lib/                    # Utilities (JWT, OTP, password, errors, responses)
    templates/              # Email HTML templates
    jobs/                   # Scheduled tasks (empty)
    helpers/                # (empty)
```

## Architecture

```
Routes -> Controllers -> Services -> Repositories -> Models
  |          |              |
  |     Middleware     Templates/Lib
  |
 Validation
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Gmail account with app password (for email OTP)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the backend root:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/fitcher
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:3000`.

## API Endpoints

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/signup` | Register new user (customer role) | No |
| POST | `/auth/verify-email` | Verify email with OTP | No |
| POST | `/auth/resend-otp` | Resend verification OTP | No |
| POST | `/auth/login` | Login, returns JWT tokens | No |
| POST | `/auth-refresh-token` | Refresh access token | No |
| POST | `/auth/logout` | Clear tokens and cookies | Yes |

### Projects

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| POST | `/projects` | Create a project | Yes | customer |
| GET | `/projects/me` | Get own projects | Yes | customer |
| PATCH | `/projects/:projectId` | Update own project | Yes | customer |
| PATCH | `/projects/:projectId/close` | Cancel/close project | Yes | customer |
| GET | `/projects/search` | Search open projects | No | Public |
| GET | `/projects/:projectId` | Get project by ID | No | Public |

### Contractors

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/contractors/profile` | Create contractor profile | Yes |
| GET | `/contractors/me` | Get own profile | Yes |
| PATCH | `/contractors/me` | Update own profile | Yes |
| GET | `/contractors/search` | Search contractors | No |
| GET | `/contractors/:contractorId` | Get contractor by ID | No |

### Bids

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| POST | `/bids` | Submit a bid | Yes | contractor |
| GET | `/bids/me` | Get own bids | Yes | contractor |
| PATCH | `/bids/:bidId/withdraw` | Withdraw a bid | Yes | contractor |
| GET | `/bids/project/:projectId` | Get bids on project | Yes | customer |
| PATCH | `/bids/:bidId/accept` | Accept a bid | Yes | customer |
| PATCH | `/bids/:bidId/reject` | Reject a bid | Yes | customer |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/reviews` | Create a review |
| GET | `/reviews` | Get reviews with filters |
| GET | `/reviews/:reviewId` | Get review by ID |
| PATCH | `/reviews/:reviewId` | Update a review |
| DELETE | `/reviews/:reviewId` | Delete a review |

## Data Models

### User
- `name`, `email`, `password`, `role` (customer/contractor/admin)
- `isEmailVerified`, OTP fields, `refreshToken`, `lastLoginAt`

### Project
- `customerId`, `title`, `category` (51 trade categories), `description`
- `budget` (min/max), `location` (GeoJSON with pinCode), `photos`
- `status` (open/in_progress/completed/cancelled), `expiresAt`, `selectedBidId`

### Contractor
- `userId`, `businessName`, `tradeCategories`, `servicePinCodes`
- `portfolioImages`, `kycDocuments` (Aadhar/PAN), `verificationStatus`
- `subscriptionTier` (free/pro/premium), `averageRating`, `totalCompletedProjects`

### Bid
- `projectId`, `contractorId`, `totalCost`, `completionDays`
- `materialDetails`, `warrantyTerms`, `coverNote`, `status`

### Review
- `projectId`, `reviewerId`, `contractorId`, `reviewType`
- `rating` (1-5), `comment`

## Middlewares

- **authenticate** — JWT verification from header or cookie
- **authorize** — Role-based access control
- **validate** — Zod schema validation
- **errorHandler** — Global error handler with stack traces in dev
- **Rate Limiter** — 200 requests per 15 minutes on `/api` routes
- **Helmet** — Security HTTP headers
- **CORS** — Cross-origin requests with credentials

## License

ISC
