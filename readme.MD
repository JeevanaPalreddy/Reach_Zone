# 🚀 ReachZone - https://reach-zone.vercel.app

> AI-powered cold outreach email generator for college students — craft professional emails for internships, referrals, and mentorship in seconds.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributors](#contributors)

---

## 📖 About the Project

**ReachZone** is a full-stack MERN application that helps college students generate personalized, professional cold outreach emails using the OpenAI API. Since direct email sending involves complex infrastructure, ReachZone follows a **copy-and-send** approach — the AI generates the email and the student copies it to send manually.

The platform also includes:
- 📋 **Pre-built Email Templates** for quick use
- 🎯 **Interview Prep Guide** covering HR, Technical, and Behavioral questions
- 🔥 **Email Roast Feature** — AI critiques your existing email draft

---

## ✨ Features

- 🤖 AI-generated cold emails via OpenAI API
- 🔐 JWT-based user authentication (register/login)
- 📂 Dashboard to view previously generated emails
- 📝 Pre-built email templates for internships, referrals, and mentorship
- 🎯 Interview Prep Guide by category
- 🔥 Email Roast — get AI feedback on your draft
- 👤 User profile management
- 📱 Responsive design

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI Integration | OpenAI API (GPT) |
| Authentication | JWT, bcrypt |
| Deployment | Vercel (Frontend), Render (Backend) |
| Dev Tools | VS Code, Postman, GitHub |

---

## 📁 Project Structure

```
coldreach/
├── client/                   # React + Vite Frontend
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Generator.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Prep.jsx
│   │   │   └── Roast.jsx
│   │   └── App.jsx
│   ├── .env
│   ├── index.html
│   └── vite.config.js
│
└── server/                   # Node.js + Express Backend
    ├── middleware/            # JWT auth middleware
    ├── models/               # Mongoose schemas
    ├── routes/
    │   ├── auth.js
    │   ├── emails.js
    │   ├── templates.js
    │   └── prep.js
    ├── utils/
    ├── mongoUri.js
    ├── index.js
    └── .env
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/reachzone.git
cd reachzone
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```bash
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5003
```

Start the backend:
```bash
node index.js
```

### 3. Setup the Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:
```bash
VITE_API_URL=http://localhost:5003/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `OPENAI_API_KEY` | OpenAI API key for email generation |
| `PORT` | Server port (default: 5003) |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

> ⚠️ Never push `.env` files to GitHub. Add them to `.gitignore`.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and receive JWT | ❌ |
| GET | `/api/auth/profile` | Get logged-in user profile | ✅ |
| POST | `/api/emails/generate` | Generate AI email via OpenAI | ✅ |
| GET | `/api/templates` | Fetch pre-built templates | ✅ |
| GET | `/api/prep` | Fetch interview prep questions | ✅ |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Set **Root Directory** to `client`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Add environment variable:
   ```
   VITE_API_URL = https://your-render-url.onrender.com/api
   ```
7. Deploy

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Set **Root Directory** to `server`
3. Set **Start Command** to `node index.js`
4. Add environment variables:
   ```
   MONGO_URI, JWT_SECRET, OPENAI_API_KEY, PORT
   ```
5. Deploy

---
