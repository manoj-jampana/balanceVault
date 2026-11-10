# BalanceVault Frontend

React + Vite + Tailwind CSS frontend for the BalanceVault hackathon demonstration.

## Run locally
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## Included screens
- Login and registration
- User dashboard
- Account list and local demo account creation
- Admin overview
- Onboarding review
- User management
- Audit trail

## Demo mode warning
This frontend currently uses simulated demo sessions and in-memory sample records. The login form does not authenticate credentials. The role selector is for previewing the user and admin interfaces only. Client-side route guards are not security controls. Do not use this frontend to handle real users, credentials, or financial data. The backend must enforce authentication, authorization, validation, ownership and audit controls.

## Tailwind
Uses Tailwind CSS v4 with the official Vite plugin.
