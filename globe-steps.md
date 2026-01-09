Steps (Completed So Far)

This document tracks the **completed milestones** for the GlobeBot backend. It ensures clarity, onboarding ease, and progress visibility for developers, reviewers, and stakeholders.

---

## Phase 0: Project Initialization

- [x] Created Git repository (`globot`)
- [x] Initialized Node.js project with `npm init`
- [x] Configured ES Modules (`"type": "module"`)
- [x] Installed core dependencies:

  - Express
  - Mongoose
  - dotenv
  - cors
  - nodemon

- [x] GitHub push verified with correct permissions

---

## Phase 1: Backend Core Setup

### 1. Server Bootstrap

- [x] `server.js` created
- [x] Environment variables loaded using `dotenv`
- [x] MongoDB connection initialized before server start
- [x] Server successfully running on configured port

### 2. Express App Setup

- [x] `app.js` created
- [x] Global middlewares added:

  - `express.json()`
  - `cors()`

- [x] Health check route (`GET /`) implemented

---

## Phase 2: Database (MongoDB Atlas)

- [x] MongoDB Atlas cluster created
- [x] Database user configured
- [x] Network access enabled
- [x] Connection string added to `.env`
- [x] MongoDB connection utility implemented
- [x] Successful cloud DB connection verified

---

## Phase 3: Chat Session Feature (Core Domain)

### 1. Chat Session Model

- [x] `ChatSession` schema created
- [x] Fields implemented:

  - `status` (active / ended)
  - `channel` (default: web)
  - `endedAt`
  - `createdAt`, `updatedAt` (timestamps)

### 2. Chat Session Controller

- [x] `startChat` controller implemented

  - Creates a new session
  - Returns `sessionId` and welcome message

- [x] `endChat` controller implemented

  - Validates input
  - Ends existing session safely

### 3. Chat Routes

- [x] `chat.routes.js` created
- [x] Routes implemented:

  - `POST /api/chat/start`
  - `POST /api/chat/end`

- [x] Routes registered in `app.js`

---

## Phase 4: Chat Messaging, Intent & Lead Engine

### 1. Chat Message Persistence

- [x] `ChatMessage` schema created
- [x] Messages stored with sender (`user` / `bot`)
- [x] Messages linked to chat sessions

### 2. Intent Detection & Logging

- [x] Rule-based intent detector implemented
- [x] Supported intents:

  - Country selection
  - Course selection
  - Test requirements
  - Visa query
  - Fees & scholarships
  - Counselor request

- [x] `IntentLog` schema created
- [x] Intent stored with session reference and confidence score

### 3. Lead Capture & Qualification

- [x] `Lead` schema created
- [x] Lead linked 1:1 with chat session
- [x] Mandatory lead fields supported:

  - Full name
  - Phone number
  - Email
  - Intended country
  - Intended course
  - Highest qualification
  - English test status
  - Intake preference
  - Budget range

- [x] Progressive lead capture via chat implemented
- [x] Intent → Lead field mapping implemented
- [x] Guided questions based on missing lead data
- [x] Basic email & phone detection implemented
- [x] Lead qualification logic implemented

---

## Phase 5: End-to-End Verification

- [x] Server starts without errors
- [x] `/api/chat/start` works correctly
- [x] `/api/chat/end` works correctly
- [x] Chat message flow verified end-to-end
- [x] Intent logs created correctly
- [x] Leads created and updated in MongoDB Atlas
- [x] Full request → DB → response flow verified

# need to work on normalization on db saves();

---

## Current Status

✔ **Core conversational backend is complete and stable**

The project is now ready to move into:

- Human escalation logic
- Admin panel APIs
- Knowledge base management
- Analytics & reporting
- Hybrid AI integration

**Last Updated:** 2026-01-09
