# Toxic Message Tagging & Review

React moderation dashboard for reviewing toxic player messages, ing toxicity tags, and tracking processed reports.

## Features

- Queue view with 100 local JSON reports
- Required moderation flow from queue to processed reports
- Single-message and multi-message tagging
- Multi-select toxicity types with custom label support
- Impact selection with color-coded severity pills
- Highlighted untagged rows and placeholders for empty values
- Processed report cards with comment, moderator, and timestamp
- Filters for status, toxicity type, and impact
- Pagination for large datasets
- Mobile-friendly responsive layout
- `localStorage` persistence for tagged state
- Invalid report handling

## Tech Stack

- React
- Vite
- Plain CSS

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the local dev server
- `npm run build` creates a production build
- `npm run preview` previews the production build
- `npm run lint` runs ESLint

## Data

The seed data is stored in `src/data/reportedMessages.json` and includes more than 100 reports, matching the assignment requirement.

## Hosting

This project can be deployed to Vercel, Netlify, GitHub Pages, or any static hosting provider that supports Vite builds.
