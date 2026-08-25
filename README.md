<!-- # Invoice & Receipt SaaS (Project 1) — Placeholder Name

Working repo for the Invoice & Receipt SaaS described in the Project Development Guide.
Product name, branding, and pricing are still open decisions (see Section 36 of the guide).

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
Nothing beyond MVP scope should be built before this loop works end-to-end. -->

# SELLZA — Invoice & Receipt SaaS

SELLZA is a SaaS platform designed to help small businesses manage their
sales, products, customers, invoices, and receipts from one simple dashboard.

The goal is to provide small businesses with an easy way to record sales,
manage products and customers, generate professional receipts and invoices,
and share or download them digitally.

---

## Current Project Status

SELLZA is currently in active MVP development.

The core business workflow is already implemented:

Business → Products → Customers → Sales → Receipts / Invoices

The application currently includes a functional dashboard, product
management, customer management, sales recording, receipt generation,
invoice generation, public receipt/invoice pages, digital sharing,
downloads, and public link copying.

The project is still being developed, so additional features and
production improvements will be added over time.

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Context API
- React Hook Form
- html2canvas

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- Helmet
- CORS
- Rate limiting

## Architecture

SELLZA uses a separate frontend and backend architecture:

```text
SELLZA
│
├── client/          React + Vite frontend
│
└── server/          Node.js + Express backend
The frontend communicates with the backend through REST API endpoints.

Current Folder Structure
invoice-receipt-saas/
│
├── client/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md

Implemented Features
1. Dashboard

The dashboard provides the main overview of the business application.

It acts as the central navigation point for the major business operations.

Current areas include:

Dashboard
New Sale
Products
Customers
Receipts
Invoices
2. Product Management

Businesses can manage the products they sell.

The product system is used when recording sales so that products and their
prices can be selected rather than manually entering every item.

3. Customer Management

SELLZA includes customer management so businesses can keep customer
information associated with their sales and invoices.

Customers can be used when:

Recording sales
Generating receipts
Creating invoices
Viewing customer-related information
4. Sales

The sales workflow allows a business to record a new sale.

A sale can contain:

Customer
Products/items
Quantity
Price
Subtotal
Total
Date

After a sale is successfully recorded, the application can generate a
professional receipt for that transaction.

5. Receipts

SELLZA generates a professional digital receipt from a completed sale.

The public receipt contains:

Business name
Business address
Business city/state
Business phone
Receipt number
Payment status
Sale date
Customer name
Purchased items
Quantity
Unit price
Item subtotal
Total amount
Business receipt footer message
SELLZA branding

The receipt uses a consistent SELLZA brand accent.

6. Public Receipt Pages

Receipts can be accessed through a public token-based URL.

The public receipt page is designed so that the recipient can view the
receipt without needing to access the business dashboard.

Receipt data is retrieved through:

GET /receipts/public/:token
7. Receipt Sharing

Receipt sharing has been implemented using html2canvas.

The Share Receipt button does NOT simply share the browser URL.

Instead:

Receipt
   ↓
html2canvas
   ↓
Generate PNG image
   ↓
Create File
   ↓
Web Share API
   ↓
Share receipt image

This allows the receipt itself to be shared as an image through supported
devices/apps.

If image sharing is unavailable, the application can fall back to
downloading the generated receipt image.

8. Receipt Download

Users can generate a PNG image of the receipt and download it.

The generated image contains the actual receipt design rather than a
screenshot of the entire browser page.

9. Receipt Link Copying

The public receipt URL can also be copied manually.

This is intentionally separate from the Share Receipt functionality.

Share Receipt
→ Shares receipt image

Copy receipt link
→ Copies public receipt URL
10. Receipt Printing

Receipts can also be printed or saved as PDF using the browser's print
functionality.

The print layout hides the application's action buttons so that they do not
appear in the printed document.

11. Receipt Navigation

The public receipt page contains:

← Back to Receipts

This takes the user back to the receipts list.

The receipt page does not send the user back to the sales page because the
receipt belongs to the receipt-management workflow.

12. Invoices

SELLZA also supports professional invoices.

Invoices contain information such as:

Business name
Business address
Business phone
Customer
Invoice date
Due date
Invoice status
Items
Quantity
Unit price
Subtotal
Amount due
Notes
SELLZA branding

Invoice status can display:

Paid
Unpaid
Overdue
13. Public Invoice Pages

Invoices can be accessed through a public token-based URL.

Invoice data is retrieved through:

GET /invoices/public/:token

The public invoice page allows customers or recipients to view the invoice
without accessing the private business dashboard.

14. Invoice Sharing

Invoices use the same image-sharing system as receipts.

The Share Invoice button generates an image of the actual invoice using
html2canvas.

The flow is:

Invoice
   ↓
html2canvas
   ↓
Generate PNG image
   ↓
Create File
   ↓
Web Share API
   ↓
Share invoice image

The Share Invoice button does NOT share the invoice URL.

15. Invoice Download

Users can generate and download the invoice as a PNG image.

The generated image contains the actual invoice card.

16. Invoice Link Copying

Users can separately copy the public invoice URL.

The functions are intentionally separated:

Share Invoice
→ Shares invoice image

Download Invoice
→ Downloads invoice image

Copy invoice link
→ Copies public invoice URL
17. Invoice Printing

Invoices can also be printed or saved as PDF through the browser's print
function.

The action controls are hidden during printing.

18. Invoice Navigation

The public invoice page contains:

← Back to Invoices

This returns the user to the invoice list.

It does not send the user back to the dashboard or sales page.

19. Public Document Architecture

Both receipts and invoices use token-based public pages.

Conceptually:

Private Dashboard
      │
      ├── Receipt
      │      ↓
      │   Public Receipt
      │
      └── Invoice
             ↓
          Public Invoice

This allows businesses to share individual documents without exposing the
main dashboard.

20. Document Sharing Architecture

SELLZA intentionally separates three different actions.

Share

Shares an image of the document.

Share Receipt
Share Invoice
Download

Downloads the generated document image.

Download Receipt
Download Invoice
Copy Link

Copies the public URL.

Copy receipt link
Copy invoice link

These actions should not be combined.

21. API Communication

The frontend communicates with the Express backend through a centralized
Axios API service.

API requests are used for operations such as:

Authentication
Products
Customers
Sales
Receipts
Invoices
Public document retrieval
22. Backend Architecture

The backend follows a modular Express structure.

server/
│
├── config/
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── utils/
│
└── server.js
Controllers

Business logic is separated into controllers.

Models

MongoDB/Mongoose models represent application data.

Routes

API endpoints are separated into route modules.

Middleware

Middleware handles concerns such as authentication, security, CORS,
and request protection.

23. Security

The backend uses several security measures including:

JWT authentication
bcrypt password hashing
Helmet
CORS
Rate limiting
Environment variables for secrets

Sensitive environment variables must not be committed to GitHub.

24. Environment Variables

Environment variables are stored locally in .env files.

Example configuration files are provided through .env.example.

Never commit real:

Database credentials
JWT secrets
API keys
Payment keys
Other private credentials

to the repository.

25. Development Setup
Clone the repository
git clone https://github.com/Raph3rr/invoice-receipt-saas.git
cd invoice-receipt-saas
Backend
cd server
npm install

Create the environment file:

cp .env.example .env

Fill in the required environment variables.

Then run:

npm run dev

The backend runs on the configured local server port.

Frontend

Open another terminal:

cd client
npm install

Create the environment file:

cp .env.example .env

Then run:

npm run dev

The Vite development server will provide the local frontend URL.

26. Development Rules

The following rules should be followed while continuing development.

Rule 1 — Current code is the source of truth

The latest code in the GitHub repository represents the current state of
SELLZA.

Older conversations, old generated files, and outdated documentation must
not override the current implementation.

Rule 2 — Inspect existing code before replacing files

Before replacing an existing component or page, inspect the current version
and preserve existing functionality unless the change specifically requires
otherwise.

Rule 3 — Do not remove working functionality accidentally

When adding a feature, existing features such as:

Navigation
API calls
Styling
Sharing
Downloading
Printing
Link copying
Authentication
Existing business logic

must be preserved unless intentionally changed.

Rule 4 — Keep frontend and backend responsibilities separated

Frontend UI logic belongs in the client.

Business logic, database operations, authentication, and API processing belong
in the server.

Rule 5 — Test before committing

Changes should be tested locally before being committed and pushed.

27. Current MVP Workflow

The primary business workflow is:

Business
   ↓
Dashboard
   ↓
Add Products
   ↓
Add Customers
   ↓
Record Sale
   ↓
Generate Receipt
   ↓
View Receipt
   ├── Share Receipt Image
   ├── Download Receipt
   ├── Copy Receipt Link
   └── Print / Save as PDF

The invoice workflow is:

Business
   ↓
Dashboard
   ↓
Invoices
   ↓
Create / View Invoice
   ↓
Public Invoice
   ├── Share Invoice Image
   ├── Download Invoice
   ├── Copy Invoice Link
   └── Print / Save as PDF
28. Current Development Focus

The project is currently moving beyond the initial setup stage and toward a
complete production-ready MVP.

Current priorities include:

Completing and polishing the core business workflows
Improving UI/UX
Testing frontend/backend integration
Handling edge cases
Improving validation and error handling
Authentication and authorization hardening
Production deployment
Database and API reliability
Business settings
Additional SaaS functionality
Payment integration
Production-level security
29. Planned / Future Features

Potential future features include:

Business profile/settings
Custom business branding
More invoice customization
Receipt customization
Payment integration
Paystack integration
Flutterwave integration
Cloudinary/image storage
Subscription plans
SaaS billing
Analytics and reporting
Advanced sales reports
Export functionality
Additional business management tools
Production monitoring

These features should be added progressively and should not break the
existing MVP workflow.

30. Project Philosophy

SELLZA is being built primarily for small businesses that need a simple,
practical way to manage everyday sales and documentation.

The application should prioritize:

Simplicity
Speed
Reliability
Mobile-friendly interfaces
Professional documents
Easy sharing
Easy business management
Clear user experience

The product should avoid unnecessary complexity during MVP development.

31. Source of Truth

The GitHub repository is the authoritative source for the current project.

Repository:

https://github.com/Raph3rr/invoice-receipt-saas

When working with AI development tools, always inspect the current repository
before generating replacement files.

Do not assume that previous AI conversations represent the latest state of
the project.

If previous context conflicts with the current repository code, the current
repository code takes priority.

32. Project Status Summary

Current major areas:

Feature	Status
React/Vite frontend	Implemented
Express backend	Implemented
MongoDB/Mongoose architecture	Implemented
Dashboard	Implemented
Product management	Implemented
Customer management	Implemented
Sales workflow	Implemented
Receipt generation	Implemented
Public receipts	Implemented
Receipt image sharing	Implemented
Receipt image download	Implemented
Receipt link copying	Implemented
Receipt printing	Implemented
Invoice functionality	Implemented
Public invoices	Implemented
Invoice image sharing	Implemented
Invoice image download	Implemented
Invoice link copying	Implemented
Invoice printing	Implemented
Authentication/security foundation	Implemented / ongoing
Production hardening	Ongoing
Payments	Planned
SaaS subscriptions	Planned
Advanced analytics	Planned
SELLZA

Sell smarter. Track everything.

Built as an Invoice & Receipt SaaS for modern small businesses.


This is the version I'd use as the new source-of-truth README. It specifically tells Claude that **the repository code overrides its old memory**, which is the important part for your synchronization plan.

I can also turn this into an actual `README.md` file for you to drop into the repo, but **I can't directly commit to your GitHub repository from this chat because the GitHub write connector isn't connected here**. The current repository itself is publicly readable, and I used its actual structure while preparing this. :contentReference[oaicite:1]{index=1}