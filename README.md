# Tally

A budgeting app built with React, Vite, Tailwind CSS v4, Recharts and Lucide icons.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure

- `src/App.jsx`: app shell, tabs, quick-add wiring, undo toasts
- `src/lib/budget.js`: categories, sample month, and all the math (safe-to-spend, cash-flow projection, goal timelines)
- `src/hooks/useLocalStorage.js`: state that survives refreshes (key `ledgerly.v1`)
- `src/components/`
  - `Navbar`: top bar with tabs, a bottom tab bar on phones, theme toggle and reset menu
  - `StatCards`: safe to spend today, left this month, daily pace, goal
  - `BudgetProgress`: spent vs. target per category, with inline target editing
  - `SetupPanel`: income, allocation bar ("% allocated"), fixed expenses, suggested targets
  - `Charts`: planned vs. actual bars and the cash-flow projection
  - `RecentActivity`: logged expenses, grouped by day
  - `ExpenseModal`: quick-add sheet (press **N** anywhere or tap +)
  - `WhatIfSimulator`: sliders and presets that show the impact on your savings goal
  - `Fab`, `Toast`, `ui` (Card, ProgressBar, Ring, MoneyInput, Slider, Button)
