# BalanceVault Frontend

React, Vite, and Tailwind CSS frontend for the BalanceVault secure account management application.

## Live Application

https://balance-vault-beta.vercel.app/login

## Technology Stack

- React
- Vite
- Tailwind CSS v4
- React Router
- Lucide React
- REST API integration

## Features

### Authentication
- User registration.
- User login.
- JWT-based authentication through the backend.
- Protected frontend routes.

### User Dashboard
- View account information.
- Create accounts.
- View account balances calculated from ledger entries.
- Perform simulated deposits and withdrawals.
- Transfer between eligible accounts.
- View transaction history.

### Administrator Dashboard
- View registered users.
- Review onboarding applications.
- Approve or reject applications.
- View audit logs.
- Search and filter user and audit information.

## Backend Integration

The frontend communicates with the BalanceVault Express backend through a centralized API service.

**Production backend:**

https://balancevault-363x.onrender.com

**API base URL:**

https://balancevault-363x.onrender.com/api

## Run Locally

### Prerequisites

- Node.js 20+
- npm
- BalanceVault backend running locally or remotely.

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:4000/api
```

For production, the Vercel environment variable is:

```env
VITE_API_URL=https://balancevault-363x.onrender.com/api
```

### Start Development Server

```bash
npm run dev
```

Open the URL printed by Vite, normally:

http://localhost:5173

### Production Build

```bash
npm run build
```

The production build is generated in the `dist` directory.

## Authentication and Security

- Authentication is handled by the backend.
- JWT access tokens are stored in sessionStorage.
- Administrator permissions are enforced by backend middleware.
- Frontend route protection is for navigation and user experience only.
- Backend authorization remains the actual security boundary.

## Deployment

The frontend is deployed on Vercel.

Live URL:

https://balance-vault-beta.vercel.app/login

The backend is deployed separately on Render.

