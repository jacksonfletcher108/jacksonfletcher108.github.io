# Tally

A budgeting app built with React, Vite, Tailwind CSS v4, Recharts and Lucide icons. Live at https://jacksonfletcher108.github.io/budget/

```bash
npm install
npm run dev                                   # http://localhost:5173
npx vite build --base /budget/ --outDir ../jacksonfletcher108.github.io/budget --emptyOutDir
```

## How it's organized

- `src/App.jsx`: app shell, tabs (Today, Budget, Goal), add/edit/delete with undo, setup on first open
- `src/lib/budget.js`: categories, example month, and all the math (spending money, what you can spend today, first-month proration, suggested split, pace status, what-if apply)
- `src/hooks/useLocalStorage.js`: saved state (key `ledgerly.v1`, kept from the old name so nobody loses data)
- `src/components/`
  - `SetupWizard`: pay (with pay frequency), bills, savings, then the plan it builds
  - `TodayView`: what you can spend today, categories, day-by-day chart, bills, goal, recent spending
  - `BudgetView`: take-home pay, left to plan, bills, spending money per category, savings
  - `WhatIfSimulator`: the Goal tab; goal settings, what-if sliders, and Apply
  - `ExpenseModal`: add or edit spending (press **N** on a keyboard)
  - `CategorySheet`: one category's spending this month
  - `Navbar`, `Toast`, `Charts` (tooltip helpers), `ui` (Card, ProgressBar, Ring, MoneyInput, Slider, Button)
