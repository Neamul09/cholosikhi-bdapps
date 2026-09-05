# 🚀 CholoSikhi (চলো শিখি) — bdapps Mobile Gateway Edition

> **Bangladesh's Premier Gamified Mobile Programming Academy for Robi & Cirkle Subscribers**

[![Live Demo](https://img.shields.io/badge/Vercel-cholosikhibdapps.vercel.app-blue?style=for-the-badge&logo=vercel)](https://cholosikhibdapps.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**CholoSikhi (চলো শিখি)** is a full-featured, gamified mobile programming learning platform integrated directly with **Robi & Cirkle bdapps Telecom Subscription API Gateway**. It allows learners across Bangladesh to master software engineering fundamentals (**Python** and **C++**) through bite-sized interactive lessons, live code compilation, real-time feedback, gamified XP points, streak mechanics, and competitive national leaderboards.

---

## ✨ Key Features & Highlights

- 📱 **bdapps API Gateway Integration**:
  - **OTP Authentication**: Real-time 6-digit SMS OTP verification via telecom gateway.
  - **Mobile & Password Auth**: Password hashing using SHA-256 with dual database & local storage fallback.
  - **Subscription Status Verification**: Live checks against bdapps gateway subscription endpoints.
  - **Payment Pending Flow**: Users with pending billing can log in to view their profile dashboard while premium learning routes remain securely locked until payment activation (৳2.78/day).
- 🐍 **Comprehensive Curricula**:
  - **Python Course**: Beginner to advanced bite-sized modules translated into authentic Bangla.
  - **C++ Course**: Core syntax, object-oriented concepts, and memory management.
- ⚡ **Live In-Browser Code Playground**: Real-time code execution and stdout inspection.
- 🎮 **Gamification Engine**:
  - Daily Streak Counters & Fire Animations.
  - XP Points, Gems, and Hearts system.
  - Level-Up popups and Achievement Unlocks.
  - Global & Regional Leaderboards.
- 🔒 **Enterprise-Grade Security**:
  - Content Security Policy (CSP) with explicit script-src guidelines.
  - Database Row Level Security (RLS) policies.
  - Strict input validation and SHA-256 credential hashing.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript (Strict Mode), Vite 8
- **Styling & Motion**: Tailwind CSS 4, Framer Motion
- **State Management**: Zustand (`authStore`, `userStore`, `settingsStore`, `progressStore`, `questStore`)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, RPC functions)
- **Telecom Gateway**: bdapps cURL / Form URL-Encoded API Wrappers
- **Icons & UI Assets**: Lucide React, Custom SVG Vector assets

---

## 📁 Repository Directory Structure

```
CholoSikhi - bdapps/
├── index.html                   # Entry HTML with CSP rules & font preloads
├── vercel.json                  # Vercel deployment rewrites & security headers
├── sql/                         # Database schema migrations & RLS policies
│   └── bdapps_users.sql         # Supabase table definition for bdapps users
├── src/
│   ├── components/              # Modular UI components
│   │   ├── common/              # Toaster, Modals, Buttons
│   │   └── layout/              # AppShell navigation & ProtectedRoute guard
│   ├── content/                 # Curriculum data & localized lesson content
│   ├── lib/                     # Audio manager & Supabase client wrapper
│   ├── pages/                   # Auth, Welcome, Home, Profile, Playground, etc.
│   ├── services/                # bdapps Gateway API service wrapper
│   ├── store/                   # Zustand global state stores
│   ├── App.tsx                  # Root application router & initialization
│   └── main.tsx                 # React entry point
└── README.md                    # Official documentation
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Neamul09/cholosikhi-bdapps.git
   cd cholosikhi-bdapps
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory following `.env.example`.

4. **Launch local development server**:
   ```bash
   npm run dev
   ```

5. **Build & Verify Production Bundle**:
   ```bash
   npm run build
   ```

---

## 📜 License

Distributed under the **MIT License**. Created with ❤️ by **Md. Neamul Morshed Neon**.
