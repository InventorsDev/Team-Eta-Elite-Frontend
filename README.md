# Safelink — Escrow-powered secure transactions between buyers and sellers

## Description of the project
Safelink is a web application that enables buyers and sellers to transact securely using an escrow flow. A seller creates an order and shares a secure payment link with the buyer. The buyer funds the order (via Paystack), and funds are held in escrow until delivery is confirmed. Once the buyer confirms delivery, funds are released to the seller. The project is built with React (Vite), integrates Paystack for payments, and uses Supabase for data/auth and supporting services. It also includes lightweight serverless APIs (e.g., create order, confirm delivery) for core escrow actions.

## Features available
- Create escrow-backed orders with clear terms and amount
- Share a secure “safelink” payment link with the buyer
- Pay with Paystack (buyer funds are held in escrow)
- Order lifecycle management:
  - Created → Delivered → Confirmed → Released
- Confirm delivery flow to release funds to the vendor using unique code generated on order creation
- Supabase integration for data and auth primitives
- Responsive UI, modern build tooling (Vite), and Tailwind CSS styling
- Lottie animations for improved UX

## Project file structure
```text
.
├─ .gitignore
├─ .npmrc
├─ .vscode/
├─ api/
│  ├─ confirm-delivery.js         # Serverless function to confirm delivery
│  └─ create-order.js             # Serverless function to create/initiate an order
│  └─ paystack-transfer.js        # Serverless function to transfer funds to vendor buyer
├─ public/
│  ├─ fav.svg
│  ├─ flyer.jpg
│  ├─ vendor.jpg
│  ├─ vite.svg
│  ├─ icons/                      # Static icons
│  └─ lotties/                    # Lottie animation assets
├─ src/
│  ├─ App.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ assets/                     # Local images and static assets
│  ├─ components/                 # Reusable UI components
│  ├─ contexts/                   # React context providers (state, auth, etc.)
│  ├─ lib/                        # Client helpers (e.g., SDK/config wrappers)
│  ├─ pages/                      # Route-level pages
│  └─ utils/                      # Utility functions
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
└─ README.md
```

## Steps to run the project locally
- Prerequisites:
  - Node.js 18+ and npm
  - A Paystack account (to obtain a public & secret key for test mode)
  - A Supabase project or local Supabase setup (optional but recommended)
  - Vercel CLI if you want to run the serverless functions in the `api/` folder locally

1) Clone and install
- git clone https://github.com/InventorsDev/Team-Eta-Elite-Frontend.git
- cd Team-Eta-Elite-Frontend
- npm install

2) Configure environment variables (create a .env.local file in the project root)
- Vite exposes only variables prefixed with VITE_. The variables:
  - VITE_SUPABASE_URL=<supabase_project_url>
  - VITE_SUPABASE_ANON_KEY=<supabase_anon_key>
  - VITE_PAYSTACK_PUBLIC_KEY=<paystack_public_key>

  - PAYSTACK_SECRET_KEY=<paystack_secret_key>

3) Start the frontend
- npm run dev
- Open http://localhost:5173

4) (Optional) Run API routes locally
- The functions in /api are designed for a serverless environment (e.g., Vercel).
- To run locally, install and use Vercel CLI:
  - npm i -g vercel
  - vercel dev
- In development, you can:
  - Run Vite (npm run dev) in one terminal
  - Run **vercel dev** in another terminal
- Make sure any API URLs used in the frontend point to the local dev serverless endpoint when testing locally.

## Technology used
- React 19 and React Router 7 (client-side routing)
- Vite 7 (fast dev server and bundler)
- Tailwind CSS 4
- Supabase JS (v2) for database/auth integrations
- Paystack via react-paystack for payments
- Lottie animations via @lottiefiles/react-lottie-player
- ESLint 9 for linting
- Utility libraries: bcryptjs, dotenv, slugify

## Test Login Details
For **Vendor**: 
  Email: ```omoniyiopemipo84@gmail.com```
  Password: ```Password@1```
  
For **Buyer**: 
  Email: ```omoniyiopemipo8@gmail.com```
  Password: ```Password@1```

## Link to live application

[https://team-eta-elite-frontend-ismi.vercel.app/](https://team-eta-elite-frontend.vercel.app/)

## Video demo / presentation

https://www.loom.com/share/79972c84d8c34c95aaa28ca61bd60d79

## Final presentation file
[team-eta-elite-final-presentation](https://www.canva.com/design/DAGz0-dApSM/q1eHhIU8wqTPVTPA1kvupw/view?utm_content=DAGz0-dApSM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6fca62d741#1)

## Limitations
- Paystack (free/test usage) limitations:
  - Test mode only processes simulated payments. Real transactions require going live and a verified business account (Including having a SON registration certficate for transfers).
  - Transaction charges apply on live mode; free/test usage is primarily for development and will not reflect production settlement flows.
  - But the cost in live mode is ₦100 + 1.5% of transaction fee
- Local development for serverless endpoints:
  - The /api functions are designed for a serverless platform (e.g., Vercel). Running them locally requires additional tooling (e.g., Vercel CLI).
- Environment configuration:
  - Missing or incorrect environment variables (Supabase URL/keys, Paystack public key) will prevent key features (auth/data/payment) from working.
- For paystack free tier cost there are limitations:
  - While testing is free, production usage incurs per-transaction fees; some capabilities and higher limits typically depend on account verification and region-specific policies.

## Future improvements
- KYC: Implement end-to-end KYC/verification to unlock higher payment limits and improve trust.
- WhatsApp bot: Provide order updates, payment links, and confirmations through a WhatsApp integration.
- Dispute resolution: In-app workflows for disputes, including evidence submission, mediation tools, and escrow logic enhancements.
