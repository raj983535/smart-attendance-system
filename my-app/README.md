# 🎓 Smart Attendance & Management System

An intelligent, full-featured web-based attendance management system built with Next.js 14, React, TypeScript, and Tailwind CSS. The platform supports AI face-recognition camera attendance simulation, manual attendance tracking, student and faculty portals, comprehensive analytics, leave request workflows, and exportable reports.

---

## 🚀 Key Features

### 👤 Role-Based Portals
- **Student Portal**:
  - Personal attendance overview and subject-wise attendance metrics.
  - Interactive attendance charts and trend visualization.
  - Leave application submission with real-time status tracking (Pending, Approved, Rejected).
- **Faculty Portal**:
  - Class-wise and subject-wise attendance management.
  - Student roster directory with search, filter, and detailed profile inspection.
  - Leave request review and approval dashboard.
  - Quick action widgets for rapid class logging.

### 📷 Camera & AI Face Detection Attendance
- Live webcam integration for automated, contact-free attendance.
- Simulated real-time face detection bounding boxes and confidence score overlay.
- Automated student identification and instant batch attendance marking.

### 📝 Manual Attendance Logging
- Clean grid/table interface for faculty to mark present, absent, or late statuses.
- Batch actions ("Mark All Present", quick resets).

### 📊 Analytics & Reporting
- Visual subject-wise breakdown charts and historical attendance curves powered by Recharts.
- Automated low-attendance alerts for at-risk students.
- Export attendance reports in multiple formats (CSV, PDF, Excel).
- Saved report templates and historical report downloads.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Primitives**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended, tested on Node v20/v24)
- npm, pnpm, or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Production Build

To test or build the optimized production bundle:
```bash
npm run build
npm run start
```

---

## 🔑 Login & Demo Usage

The system features client-side mock authentication persisted via `localStorage`:
- **Student Access**:
  - Select the **Student** tab.
  - Enter any valid email (e.g., `student@college.edu`) and password (minimum 3 characters).
  - Click **Sign In** (or click **Need an account? Sign up**).
- **Faculty Access**:
  - Select the **Faculty** tab.
  - Enter any faculty email (e.g., `faculty@college.edu`) and password.
  - Click **Sign In**.

---

## 📁 Project Structure

```
my-app/
├── app/
│   ├── layout.tsx         # Global root layout & font configuration
│   ├── page.tsx           # Home page with auth routing
│   ├── globals.css        # Tailwind styling & CSS variable theme
│   └── reports/
│       └── page.tsx       # Dedicated attendance reports & export page
├── components/
│   ├── ui/                # Accessible Radix UI components (cards, buttons, dialogs, etc.)
│   ├── camera-attendance.tsx        # Camera face-recognition attendance module
│   ├── manual-attendance.tsx        # Manual attendance marking grid
│   ├── student-dashboard.tsx        # Student view & metrics
│   ├── faculty-dashboard.tsx        # Faculty view & classroom management
│   ├── analytics-dashboard.tsx      # Attendance data charts & statistics
│   ├── leave-request-form.tsx       # Student leave application
│   ├── leave-requests-manager.tsx   # Faculty leave approval dashboard
│   ├── student-list.tsx             # Student directory & profile cards
│   ├── report-generator.tsx         # Attendance report export engine
│   └── login-form.tsx               # Authentication card for student/faculty
├── lib/
│   ├── auth.ts            # Authentication state handling
│   ├── attendance-utils.ts# Attendance helper calculation methods
│   ├── face-detection.ts  # Simulated face detection algorithms
│   ├── mock-data.ts       # Mock students, faculty, subjects, and records
│   └── types.ts           # Central TypeScript types & interfaces
└── public/                # Static assets and icons
```
