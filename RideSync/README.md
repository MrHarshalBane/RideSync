# 🏍️ RideSync - Real-Time Biker Group Ride Tracking System

> **Full-Stack Web Application | MERN Stack | Socket.IO | Real-Time Telemetry & Off-Route Alerts**  
> *Developed by Harshal Bane (Thakur College of Engineering & Technology - TCET, Mumbai)*

---

## 🌟 Project Overview

**RideSync** is a full-stack, real-time group ride tracking web application designed specifically for motorcycle riding clubs, biker groups, and touring enthusiasts. 

In group riding, keeping riders together and ensuring no one gets lost or left behind is a major safety challenge. RideSync solves this by empowering a **Ride Leader** to create a ride session, generate a unique 8-character **Ride Code**, and broadcast their live GPS location in sub-second intervals to all joined **Followers**.

Riders view live updates on a custom dark-themed interactive map with heads-up telemetry displays (Speed, ETA, Distance Remaining, Off-Route warnings, and live group chat).

---

## 🔥 Key Features

- 🔑 **Unique 8-Character Ride Code**: Leaders spawn rides instant-sharable via 8-character codes (`e.g. RS-98X2B`).
- ⚡ **Sub-Second Live GPS Sync**: Real-time Socket.IO WebSocket telemetry streaming leader and follower locations.
- 🗺️ **Interactive Dark-Themed Map**: Custom dark map styling with distinct leader/follower vehicle markers, live polylines, and dynamic viewport bounds.
- 🚨 **Automated Off-Route Alerting**: Haversine distance detection automatically triggers audio-visual popups when a follower strays beyond a safety threshold (e.g. >100m) from the planned route or leader.
- 📊 **Heads-Up Telemetry HUD**: Floating telemetry dashboard showing real-time ETA, remaining route distance, average speed, and active rider count.
- 🛡️ **JWT Role-Based Security**: Complete authentication system supporting `rider` and `admin` roles with bcrypt hashing and JWT tokens.
- 👨‍💼 **Admin Dashboard**: Comprehensive administration suite to view platform metrics, manage registered users (block/unblock/delete), and oversee active/completed rides.
- 📜 **Ride History & Analytics**: Post-ride statistics including total distance covered, ride duration, timestamps, and participant logs.
- 💬 **Live In-Ride Chat & SOS Button**: Instant socket-driven emergency SOS broadcast and in-ride quick messaging.
- 🎮 **Built-in GPS Route Simulator**: Test live telemetry directly in your desktop browser without needing to physically travel!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (v18), React Router v6, Lucide Icons, Leaflet / React-Leaflet |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM (includes fallback in-memory store for instant zero-config startup!) |
| **Real-Time Communication** | Socket.IO (WebSockets) |
| **Authentication** | JWT (`jsonwebtoken`) + `bcryptjs` password hashing |
| **Maps & Spatial Math** | Leaflet / Google Maps API fallback + Haversine Geometry formula |
| **Styling** | Custom CSS Design System (Dark mode, glassmorphism, responsive grid) |

---

## 🏗️ Project Architecture

```
RideSync/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API route handlers (Auth, Rides, Admin)
│   ├── middleware/      # JWT authentication & admin authorization
│   ├── models/          # Mongoose models (User, Ride, RideLog)
│   ├── routes/          # Express API endpoints
│   ├── sockets/         # Socket.IO real-time event handlers
│   ├── utils/           # Haversine distance & off-route detector
│   └── server.js        # Express app entry point
├── frontend/
│   ├── public/          # HTML template & assets
│   └── src/
│       ├── components/  # Navbar, Telemetry HUD, MapView, Chat, Modals
│       ├── context/     # AuthContext & SocketContext
│       ├── pages/       # Home, Login, Register, Dashboard, LiveRide, Admin, History
│       ├── services/    # Axios API client & Socket wrapper
│       ├── styles/      # Custom Dark Theme CSS design system
│       └── utils/       # Haversine math & GPS Route Simulator
├── docs/
│   └── PROJECT_BLACKBOOK.md  # Detailed Academic Blackbook Documentation
├── README.md
└── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (Optional: app automatically uses fallback in-memory mode if MongoDB server is not running!)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/RideSync.git
cd RideSync

# Install root, backend, and frontend dependencies in one command
npm run install-all
```

### 2. Configure Environment Variables
- Copy `backend/.env.example` to `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ridesync
JWT_SECRET=ridesync_super_secret_jwt_key_2026
```

### 3. Run Application Locally
```bash
# Start both backend and frontend concurrently
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 📸 Screenshots & Documentation

Detailed system design, Data Flow Diagrams (DFDs), Use Case, Sequence, Class, and ER diagrams can be found in [`docs/PROJECT_BLACKBOOK.md`](docs/PROJECT_BLACKBOOK.md).

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
