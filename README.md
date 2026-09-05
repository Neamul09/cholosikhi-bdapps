# 🚀 CholoSikhi (চল শিখি) — bdapps Mobile Gateway Edition

> **Bangladesh's Premier Gamified Mobile Programming Academy for Robi & Cirkle Subscribers**

[![Live Demo](https://img.shields.io/badge/Vercel-cholosikhibdapps.vercel.app-blue?style=for-the-badge&logo=vercel)](https://cholosikhibdapps.vercel.app)
[![bdapps Gateway](https://img.shields.io/badge/bdapps-Gateway_Integrated-emerald?style=for-the-badge)](https://bdappsdigitalapps.com/CholoSikhi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**CholoSikhi (চল শিখি)** is a full-featured, gamified mobile programming learning platform integrated directly with **Robi & Cirkle bdapps Telecom Subscription API Gateway**. It allows learners across Bangladesh to master software engineering fundamentals (**Python** and **C++**) through bite-sized interactive lessons, live code compilation, real-time feedback, gamified XP points, streak mechanics, and competitive national leaderboards.

---

## ✨ Key Features & Highlights

- 📱 **bdapps API Gateway Integration**:
  - **OTP Authentication**: Real-time 6-digit SMS OTP verification.
  - **Mobile & Password Auth**: Password hashing using SHA-256 with dual Supabase DB & LocalStorage fallback.
  - **Subscription Status Verification**: Live checks against bdapps gateway endpoints (`check_subscription.php`, `send_otp.php`, `verify_otp.php`, `unsubscribe.php`).
  - **Payment Pending Flow**: Users with pending billing (`INITIAL CHARGING PENDING` / `PENDING_CHARGE`) can log in to view their profile dashboard while premium learning routes remain securely locked until payment activation (৳2.78/day).
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
  - Supabase Row Level Security (RLS) policies.
  - Strict input validation and SHA-256 credential hashing.

---

## 📋 bdapps Application Specs

| Parameter | Details |
| :--- | :--- |
| **App Name** | CholoSikhi |
| **App ID** | `APP_140038` |
| **Developer Name** | Md. Neamul Morshed Neon |
| **Username** | `neamulmorshedneon` |
| **Access Mode** | SMS / USSD / Web App |
| **App Code** | `73469` |
| **Host IP** | `176.9.54.45` |
| **Production URL** | [cholosikhibdapps.vercel.app](https://cholosikhibdapps.vercel.app) |
| **Daily Charge** | ৳ 2.78 + (VAT + SD + SC) / day (auto-renewal) |

---

## 📲 Telecom USSD & SMS Commands

- **Subscribe via SMS**: Send `START 73469` to `21213`
- **Subscribe via USSD**: Dial `*213*73469#`
- **Unsubscribe via SMS**: Send `STOP 73469` to `21213`
- **Unsubscribe via Web**: Click the **Unsubscribe** button inside Profile Settings.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript (Strict Mode), Vite 8
- **Styling & Motion**: Tailwind CSS 4, Framer Motion
- **State Management**: Zustand (`authStore`, `userStore`, `settingsStore`, `progressStore`, `questStore`)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, RPC functions)
- **Telecom Gateway**: bdapps cURL / Form URL-Encoded API Wrappers (`bdappsService.ts`)
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
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_BDAPPS_BASE_URL=https://bdappsdigitalapps.com/CholoSikhi
   ```

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
