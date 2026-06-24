# Ledger
I built Ledger because I wanted a simple way to track my personal finances without needing to connect my banking credentials to a third-party app.
It also doubled as the perfect side project to step out of my comfort zone, dive into full-stack development.

Right now, it serves as my central hub to combine and make sense of all my transactions scattered across various banking accounts.

### Features
- **Mess-Free CSV Imports:** I just download raw CSV statements from my different banks and upload them here. The app handles the annoying part by stripping out raw transaction numbers, store IDs, and location strings so the data actually looks clean.
- **Smart Templates:** To save myself from manual data entry, I built a templating engine. Once I set a template, any incoming transaction with a similar description automatically inherits the right name, category, and recurring status.
- **Full Data Control:** I can jump into the main transaction table at any time to manually override values, tweak names, switch categories, or toggle whether an expense is a one-off or recurring.

<img width="1902" height="1491" alt="CleanShot 2026-06-24 at 12 28 05" src="https://github.com/user-attachments/assets/044e0666-fcfe-45e1-b691-f10c92228cc1" />

### Dashboard
A quick visual snapshot of my income, expenses, overall profit, and top spending categories.

It currently handles a couple of charts [Recharts](https://recharts.github.io/), with global filters for years, specific accounts, or categories.
- Monthly expense bar chart for the year
- Category breakdown pie chart

<img width="1903" height="1492" alt="CleanShot 2026-06-24 at 12 30 42" src="https://github.com/user-attachments/assets/c1817ef6-c5b9-4792-9edf-fd6e0d7dd7b5" />

### Future Ideas
The app is active work in progress. It does the heavy lifting for now, but I want to build out deeper insights down the road. My immediate roadmap includes:

- [ ] Merchant Deep Dive: Add cards to easily spot my highest-spend merchants.
- [ ] Recurring Payment Tracker: Group recurring totals by merchant and calculate true monthly spending averages.
- [ ] Advanced Visualizations: Experiment with more granular charts and behavioral insights to spot spending trends over time.

## Resources

Collection of various links and documentation of tools and libraries used:

- [HeroUI](https://www.heroui.com/docs/guide/introduction) - UI library
- [HeroIcons](https://heroicons.com/outline) - Icon Library
- [SheetJS](https://docs.sheetjs.com/docs/) - extracting useful data from almost any complex spreadsheet (csv/xls parsing)

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase

[Generating Types](https://supabase.com/docs/guides/api/rest/generating-types)

_(Project ID can be found in Supabase Dashboard > Project Settings > General Settings > Project ID)_

```
npx supabase gen types typescript --project-id "abcdefg..." --schema public > app/lib/supabase/database.types.ts
```

---
