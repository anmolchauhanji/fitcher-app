# Fitcher App API - Complete Testing Guide

## Base URL
```
http://localhost:3000/api/v1
```

---

## 1. AUTHENTICATION ROUTES

### 1.1 Sign Up (Customer)
**POST** `/auth/signup`

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj.kumar@example.com",
    "password": "Password123!@",
    "role": "customer"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "data": {
    "_id": "user_id_here",
    "name": "Raj Kumar",
    "email": "raj.kumar@example.com",
    "role": "customer",
    "isEmailVerified": false
  }
}
```

---

### 1.2 Sign Up (Contractor)
**POST** `/auth/signup`

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Plumber",
    "email": "john.plumber@example.com",
    "password": "Password123!@",
    "role": "contractor"
  }'
```

---

### 1.3 Verify Email
**POST** `/auth/verify-email`

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj.kumar@example.com",
    "otp": "123456"
  }'
```

**Note:** Check console logs for actual OTP generated during signup

---

### 1.4 Resend OTP
**POST** `/auth/resend-otp`

```bash
curl -X POST http://localhost:3000/api/v1/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj.kumar@example.com"
  }'
```

---

### 1.5 Login
**POST** `/auth/login`

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj.kumar@example.com",
    "password": "Password123!@"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Raj Kumar",
      "email": "raj.kumar@example.com",
      "role": "customer"
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "jwt_refresh_token_here"
  }
}
```

---

### 1.6 Refresh Token
**POST** `/auth/refresh-token`

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN" \
  -d '{}'
```

---

### 1.7 Logout
**POST** `/auth/logout`

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. PROJECT ROUTES

### 2.1 Create Project
**POST** `/projects`

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Modern Kitchen Renovation",
    "category": "Carpenter",
    "description": "Need to renovate my kitchen with new cabinets, countertops, and flooring. Budget is flexible for quality work. Timeline: 2-3 weeks",
    "budget": {
      "min": 50000,
      "max": 150000
    },
    "location": {
      "coordinates": [77.5946, 12.9716],
      "address": "123, MG Road, Bangalore, Karnataka",
      "pinCode": "560001"
    },
    "photos": [
      {
        "url": "https://example.com/kitchen1.jpg",
        "publicId": "kitchen_image_1"
      }
    ],
    "scope": "Complete kitchen overhaul with modern fixtures",
    "expiresAt": "2026-07-29"
  }'
```

---

### 2.2 Get All Projects
**GET** `/projects`

```bash
curl -X GET http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2.3 Get Project by ID
**GET** `/projects/{projectId}`

```bash
curl -X GET http://localhost:3000/api/v1/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2.4 Get My Projects
**GET** `/projects/my-projects`

```bash
curl -X GET http://localhost:3000/api/v1/projects/my-projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2.5 Update Project
**PUT** `/projects/{projectId}`

```bash
curl -X PUT http://localhost:3000/api/v1/projects/PROJECT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Updated Kitchen Renovation",
    "description": "Updated description with more details",
    "budget": {
      "min": 60000,
      "max": 180000
    }
  }'
```

---

### 2.6 Delete Project
**DELETE** `/projects/{projectId}`

```bash
curl -X DELETE http://localhost:3000/api/v1/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 3. CONTRACTOR ROUTES

### 3.1 Complete Contractor Profile
**POST** `/contractors`

```bash
curl -X POST http://localhost:3000/api/v1/contractors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CONTRACTOR_ACCESS_TOKEN" \
  -d '{
    "businessName": "Premium Plumbing Solutions",
    "tradeCategories": ["Plumber", "Tile Installer"],
    "servicePinCodes": ["560001", "560002", "560003", "560004"],
    "portfolioImages": [
      {
        "url": "https://example.com/portfolio1.jpg",
        "publicId": "plumbing_work_1"
      },
      {
        "url": "https://example.com/portfolio2.jpg",
        "publicId": "plumbing_work_2"
      }
    ],
    "kycDocuments": {
      "aadhar": {
        "url": "https://example.com/aadhar.pdf",
        "publicId": "aadhar_doc"
      },
      "pan": {
        "url": "https://example.com/pan.pdf",
        "publicId": "pan_doc"
      }
    },
    "businessDescription": "Over 10 years of experience in plumbing works"
  }'
```

---

### 3.2 Get Contractor Profile
**GET** `/contractors/{contractorId}`

```bash
curl -X GET http://localhost:3000/api/v1/contractors/CONTRACTOR_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3.3 Get My Contractor Profile
**GET** `/contractors/me`

```bash
curl -X GET http://localhost:3000/api/v1/contractors/me \
  -H "Authorization: Bearer CONTRACTOR_ACCESS_TOKEN"
```

---

### 3.4 Search Contractors by Category
**GET** `/contractors/search?category=Plumber`

```bash
curl -X GET "http://localhost:3000/api/v1/contractors/search?category=Plumber" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3.5 Search Contractors by Pin Code
**GET** `/contractors/search?pinCode=560001`

```bash
curl -X GET "http://localhost:3000/api/v1/contractors/search?pinCode=560001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4. BID ROUTES

### 4.1 Create Bid
**POST** `/bids`

```bash
curl -X POST http://localhost:3000/api/v1/bids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CONTRACTOR_ACCESS_TOKEN" \
  -d '{
    "projectId": "PROJECT_ID_HERE",
    "totalCost": 75000,
    "completionDays": 14,
    "materialDetails": "We will use premium quality pipes (ISI certified), corrosion-resistant fittings, and modern fixtures. All materials will be sourced from authorized dealers.",
    "warrantyTerms": "2 year warranty on all pipe works and fittings. 6 months warranty on labor",
    "coverNote": "Our team has expertise in bathroom renovation. We ensure timely completion and quality workmanship. We provide free consultation and quotation."
  }'
```

---

### 4.2 Get All Bids for a Project
**GET** `/bids/project/{projectId}`

```bash
curl -X GET http://localhost:3000/api/v1/bids/project/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4.3 Get My Bids (Contractor)
**GET** `/bids/my-bids`

```bash
curl -X GET http://localhost:3000/api/v1/bids/my-bids \
  -H "Authorization: Bearer CONTRACTOR_ACCESS_TOKEN"
```

---

### 4.4 Accept Bid
**PATCH** `/bids/{bidId}/accept`

```bash
curl -X PATCH http://localhost:3000/api/v1/bids/BID_ID_HERE/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -d '{}'
```

---

### 4.5 Reject Bid
**PATCH** `/bids/{bidId}/reject`

```bash
curl -X PATCH http://localhost:3000/api/v1/bids/BID_ID_HERE/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -d '{}'
```

---

### 4.6 Withdraw Bid
**PATCH** `/bids/{bidId}/withdraw`

```bash
curl -X PATCH http://localhost:3000/api/v1/bids/BID_ID_HERE/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CONTRACTOR_ACCESS_TOKEN" \
  -d '{}'
```

---

## 5. REVIEW ROUTES

### 5.1 Create Review
**POST** `/reviews`

```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "projectId": "PROJECT_ID_HERE",
    "contractorId": "CONTRACTOR_ID_HERE",
    "reviewType": "customer_to_contractor",
    "rating": 5,
    "comment": "Excellent work! The contractor completed the project on time and the quality is outstanding. Very professional team. Highly recommended!"
  }'
```

---

### 5.2 Get Reviews for Contractor
**GET** `/reviews/contractor/{contractorId}`

```bash
curl -X GET http://localhost:3000/api/v1/reviews/contractor/CONTRACTOR_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5.3 Get Reviews for Project
**GET** `/reviews/project/{projectId}`

```bash
curl -X GET http://localhost:3000/api/v1/reviews/project/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5.4 Update Review
**PUT** `/reviews/{reviewId}`

```bash
curl -X PUT http://localhost:3000/api/v1/reviews/REVIEW_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Updated review comment"
  }'
```

---

### 5.5 Delete Review
**DELETE** `/reviews/{reviewId}`

```bash
curl -X DELETE http://localhost:3000/api/v1/reviews/REVIEW_ID_HERE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 6. TESTING WORKFLOW

### Step 1: Sign Up as Customer
```bash
# Create customer account
POST /auth/signup
# Save the email
```

### Step 2: Verify Email
```bash
# Check console for OTP
POST /auth/verify-email
# with email and OTP
```

### Step 3: Login
```bash
# Login with credentials
POST /auth/login
# Save accessToken and refreshToken
```

### Step 4: Create Project
```bash
# Create a project
POST /projects
# Save projectId
```

### Step 5: Sign Up as Contractor
```bash
# Create contractor account
POST /auth/signup
# Verify email
POST /auth/verify-email
# Login
POST /auth/login
```

### Step 6: Complete Contractor Profile
```bash
# Add contractor details
POST /contractors
```

### Step 7: Create Bid
```bash
# Submit bid on customer's project
POST /bids
# with projectId from Step 4
```

### Step 8: Accept Bid
```bash
# Customer accepts contractor's bid
PATCH /bids/{bidId}/accept
```

### Step 9: Leave Review
```bash
# After project completion
POST /reviews
```

---

## 7. TEST DATA SUMMARY

| Field | Sample Value |
|-------|--------------|
| Customer Email | raj.kumar@example.com |
| Contractor Email | john.plumber@example.com |
| Password | Password123!@ |
| Project Budget | 50000 - 150000 |
| Bid Amount | 75000 |
| Rating | 1-5 |
| Pin Code | 560001 |
| Location | [77.5946, 12.9716] |

---

## 8. COMMON ERRORS & SOLUTIONS

| Error | Cause | Solution |
|-------|-------|----------|
| Email already exists | Duplicate signup | Use different email |
| Invalid OTP | Wrong OTP | Check console for correct OTP |
| Unauthorized | Missing token | Include Authorization header |
| Project not found | Invalid ID | Use correct projectId |
| Bid already exists | One bid per contractor per project | Use different project |

