# Mini Fintech - Personal Finance Tracker

A professional personal finance tracker built with Next.js, TypeScript, Prisma, and SQLite. This project was developed as a take-home assignment for a software engineering role.

## Features

- **Summary Dashboard:** Real-time view of Net Balance, Total Income, Total Expenses, and your Top Spending Category.
- **Transaction Logging:** Easily add income and expenses with categories, dates, and optional notes.
- **Smart Filtering:** Dual-filter system to view transactions by category and date range simultaneously.
- **Spending Insights:** Rule-based observations that highlight spending patterns and financial health.
- **Data Visualization:** A custom horizontal bar chart showing spending breakdown by category.
- **Responsive Design:** A clean, modern "Professional" UI that works on desktop and mobile.

## Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling:** Vanilla CSS (CSS Modules & Global Variables)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js pages and layouts.
- `src/actions`: Server actions for database operations.
- `src/components`: Reusable UI components.
- `src/lib`: Shared libraries (Prisma client).
- `prisma`: Database schema and migrations.

## Deployment

This app is ready to be deployed to [Vercel](https://vercel.com/). 
Note: Since this version uses SQLite, it is intended for local demonstration. For production deployment with persistent data, it is recommended to use a hosted PostgreSQL database (like Neon or Supabase) by simply updating the `DATABASE_URL` in the `.env` file and changing the provider in `prisma/schema.prisma`.
