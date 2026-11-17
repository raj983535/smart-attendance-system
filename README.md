# 🎓 Smart Attendance & Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui)](https://www.radix-ui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An intelligent, full-featured web-based attendance management system built with **Next.js 14 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. Designed for higher education institutions, high schools, and training centers to streamline attendance tracking, minimize proxy marking, and provide real-time academic insights.

---

## 🌟 Key Highlights

- **📷 AI Face Recognition Attendance**: Automated camera-based verification with live webcam integration and a built-in virtual simulation scanner for testing without camera hardware.
- **📝 Manual Roll-Call Sheet**: Interactive roll-call checklist with "Mark All Present", "Mark All Absent", and instant CSV sheet download.
- **👥 Role-Based Dashboards**:
  - **Student Portal**: Real-time attendance percentage, subject-by-subject breakdown, interactive trend charts, exam eligibility warnings, and leave application workflow.
  - **Faculty Portal**: Class scheduling, attendance taking (biometric & manual), student roster management, leave approval dashboard, and daily lecture summaries.
- **📊 Interactive Analytics Engine**: Subject attendance curves, 30-day trends, student tier distributions (Excellent, Good, Average, At-Risk), and automated warnings.
- **📑 Institutional Reports Hub**: On-demand report generator with customizable date ranges and formats (CSV, PDF, Excel), pre-built templates, and historical download archives.
- **👤 Profile & Settings**: Account metadata modal, notification preferences toggle, and one-click role switching.

---

## 🚀 Feature Overview

### 1. 📷 Biometric Facial Recognition Camera
- **Dual Feed Modes**:
  - **Live Webcam Stream**: Connects to the device webcam with 640x480 resolution.
  - **Simulated AI Camera**: Built-in interactive virtual classroom feed with animated facial bounding boxes and confidence scores—perfect for demonstrations and automated testing.
- **Face Detection Controls**:
  - Real-time confidence threshold scoring (70% - 100%).
  - Individual student face confirmation or one-click "Confirm All".
  - One-click batch recording with verified status badges.
- **Camera Configuration Panel**: Live sliders for resolution, frame rate, auto-confirmation thresholds, and local device privacy compliance notices.

### 2. 📝 Manual Attendance Register
- Roll-call interface listing all enrolled students with roll numbers and avatars.
- Quick status switching between **Present** and **Absent**.
- Batch actions: **Mark All Present**, **Mark All Absent**, and **Reset Statuses**.
- Real-time counters showing total present, absent, unmarked, and percentage rate.
- One-click **Export CSV** for offline attendance record-keeping.

### 3. 👤 Role-Based Portals

#### 🎓 Student Experience:
- **Welcome Overview**: Live student ID, department, batch, and term standing.
- **Subject-wise Breakdown Cards**: Click any subject to open a deep-dive modal displaying classes attended, required minimum (75%), and exam eligibility status.
- **Leave Application Center**: Submit leave requests with reason and dates; instantly track status (*Pending*, *Approved*, *Rejected*).
- **Download Personal Reports**: Generate term reports and export personal attendance logs directly to CSV or formatted print.

#### 👨‍🏫 Faculty Experience:
- **Session Attendance Overview**: Real-time counter of students present vs. absent for the day.
- **Schedule Makeup Lectures**: Interactive class scheduler with subject selection, date, time, and room assignments.
- **Student Directory**: Full roster search by name or roll number, with instant email and phone number copying.
- **Leave Request Management**: Review student leave applications with one-click **Approve**, **Reject**, or **Approve All Pending** batch actions.

### 4. 📊 Analytics & Reporting Engine
- **Line Charts & Bar Visualizations**: 30-day attendance patterns, subject comparisons, and target thresholds powered by Recharts.
- **At-Risk Student Monitoring**: Dedicated modal identifying students below 75% attendance with a direct "Send Warning Notice" action.
- **Custom Report Generator**: Select date ranges, formats (PDF, Excel, CSV), and inclusion options (charts, absentees, statistics).
- **Archived Reports**: History table with preview modals, file downloads, link sharing, and email dispatches.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict mode, fully typed) |
| **Styling & Design** | [Tailwind CSS](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) Primitives, Shadcn-style Card, Dialog, Tabs, Select, Badge, Slider |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Recharts](https://recharts.org/) (LineChart, BarChart, ResponsiveContainer) |
| **Date Utilities** | [date-fns](https://date-fns.org/) |

---

## 📁 Repository Structure

```
smart-attendance-system/
├── app/
│   ├── favicon.ico             # App icon
│   ├── globals.css             # Tailwind & theme variables
│   ├── layout.tsx              # Root HTML layout with Geist font
│   ├── page.tsx                # Main portal router (Login, Student, Faculty)
│   └── reports/
│       └── page.tsx            # Dedicated institutional reports hub
├── components/
│   ├── ui/                     # Reusable UI primitives (Button, Card, Tabs, Select, etc.)
│   ├── analytics-dashboard.tsx # Charts, at-risk modal & metrics
│   ├── attendance-chart.tsx    # 30-day student attendance trend line
│   ├── attendance-overview.tsx # Faculty weekly & monthly attendance curves
│   ├── auth-provider.tsx       # Auth context & session provider
│   ├── camera-attendance.tsx   # AI webcam & simulated face recognition module
│   ├── camera-settings.tsx     # Detection sliders & camera parameters
│   ├── dummy-reports.tsx       # Institutional report cards & preview modal
│   ├── faculty-dashboard.tsx   # Comprehensive faculty management center
│   ├── header.tsx              # Navbar with navigation, profile & settings modals
│   ├── leave-request-form.tsx  # Student leave application form
│   ├── leave-requests-manager.tsx # Faculty leave approval review panel
│   ├── login-form.tsx          # Dual-role authentication card (Student/Faculty)
│   ├── manual-attendance.tsx   # Roll-call attendance register
│   ├── report-generator.tsx    # Custom report generator with filters & downloads
│   ├── report-history.tsx      # Archived reports table with preview & export
│   ├── report-templates.tsx    # Pre-built institutional report templates
│   ├── student-dashboard.tsx   # Student academic tracking portal
│   ├── student-list.tsx        # Student directory with search, contact & stats
│   └── subject-attendance-chart.tsx # Subject attendance bar chart
├── lib/
│   ├── attendance-utils.ts     # Percentage calculations & eligibility helpers
│   ├── auth.ts                 # Mock auth provider with localStorage persistence
│   ├── mock-data.ts            # 12 students, 6 subjects, 20 sessions of logs, leaves
│   ├── types.ts                # Central TypeScript types & interfaces
│   └── utils.ts                # Class merging utility (clsx + twMerge)
├── public/                     # Static media & assets
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── components.json             # Component architecture metadata
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies & run scripts
├── tailwind.config.ts          # Tailwind theme configuration
└── tsconfig.json               # TypeScript configuration
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.17 or higher recommended, tested on Node v20 & v24)
- npm, pnpm, or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/raj983535/smart-attendance-system.git
cd smart-attendance-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🔑 Demo Credentials & Quick Test

The application features instant client-side mock authentication persisted via `localStorage`:

| Role | How to Access | Example Email | Password |
| :--- | :--- | :--- | :--- |
| **Student** | Select the **Student** tab on the login screen | `student@college.edu` | Any 3+ characters (e.g. `123`) |
| **Faculty** | Select the **Faculty** tab on the login screen | `faculty@college.edu` | Any 3+ characters (e.g. `123`) |

> 💡 **Tip**: You can switch roles at any time by clicking **"Switch User"** in the top navigation bar.

---

## 🌐 Deploy to Netlify / Vercel

This repository is pre-configured for zero-configuration deployments on **Netlify** and **Vercel**:

- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: `18.x` or higher
- **Peer Dependencies**: Pre-configured via `.npmrc` (`legacy-peer-deps=true`) to avoid build-time dependency conflicts.

---

## 👨‍💻 Author & Connect

**Sahil Raj**

- **GitHub**: [@raj983535](https://github.com/raj983535)
- **X (Twitter)**: [@sahilraj369](https://x.com/sahilraj369)
- **Repository**: [smart-attendance-system](https://github.com/raj983535/smart-attendance-system)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
