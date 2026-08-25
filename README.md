# Sellza — Sell. Invoice. Grow.

Working repo for Sellza, an invoice and receipt platform for small businesses, described in the Project Development Guide.

## Stack

- **Frontend:** React + Vite (JavaScript), Tailwind CSS, React Router, Axios, Context API, React Hook Form
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JWT auth, bcrypt, Helmet, CORS, rate limiting
- **Images:** Cloudinary (configured later)
- **Payments:** Paystack / Flutterwave (configured later)

## Folder Structure

```
invoice-saas/
├── client/     React + Vite frontend
└── server/     Express backend
```

## Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env    # fill in your MongoDB URI, JWT secret, etc.
npm run dev
```

Server runs on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Development Phases

This repo currently reflects **Phase 1 — Setup** from the Development Guide:

- [x] React/Vite frontend scaffold
- [x] Express backend scaffold
- [x] Folder structure agreed in the guide
- [x] Environment variable templates
- [x] Basic security middleware (Helmet, CORS, rate limiting)
- [x] MongoDB connection config (Atlas — you provide the connection string)
- [ ] Phase 2 — Authentication (next)

See `Project_1_Invoice_Receipt_SaaS_Development_Guide.docx` for full scope, data models, API routes, and UI screens.

## First Milestone (Project Rule)

Business registers → sets up business → adds a product → records a sale →
generates a professional receipt → downloads/shares it → sees the sale in the dashboard.
Nothing beyond MVP scope should be built before this loop works end-to-end.
