# Smart Warehouse Ops (WarehouseIQ)

> **"Precision Logistics. Real-Time Operations. Control Tower Intelligence."**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6%2B-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2%2B-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1%2B-646CFF.svg)](https://vitejs.dev/)

Smart Warehouse Ops (WarehouseIQ) is an editorial-grade, full-stack warehouse operations and control-tower platform. Designed for logistics supervisors, floor controllers, and supply-chain directors, it replaces fragmented legacy spreadsheets with a unified, real-time command deck. It prioritizes actionable decision tickets over passive charts, visualizes live pallet flow tapes, and surfaces critical bottlenecks across bulk storage, fast-pick zones, and outbound staging docks.

---

## 🚀 Key Features

1. **Operations Control Tower ("Signal Room")**: Human-centered command deck built with editorial typography, quiet graphite surfaces, and high-contrast signal orange accents (#E46B35) directing immediate attention to operational bottlenecks.
2. **Decision Tickets Engine**: Actionable recommendation cards that diagnose exceptions, quantify projected delays, and recommend immediate human interventions (e.g. cross-dock reallocation, picking route bypass).
3. **Real-Time Fulfillment Flow Tape**: Directional, stage-by-stage conveyor tracking (Inbound Receipt → Quality Inspection → Bulk Putaway → Fast Picking → Staging → Final Dispatch) with pulse indicators.
4. **Interactive Warehouse Map & Heatmap**: Multi-zone facility floorplan showing occupancy percentages, thermal capacity alerts, and equipment congestion.
5. **Dynamic Shift Briefs & KPI Radar**: Real-time rollups of active picking rates, dispatch SLA countdowns, docked freight trucks, and employee zone allocations.
6. **Unified Dual Runtime**: Scaffolds both a lightning-fast Vite client development server and an production-bundled Express API server for enterprise deployment.
7. **Comprehensive Radix UI Component Suite**: 40+ accessible UI primitives tailored for industrial workflows: dialogs, drawers, command bars, sheet overlays, data tables, and telemetry graphs.

---

## 🛠 Tech Stack

- **Client Framework**: React 19, TypeScript
- **Styling & Design System**: Tailwind CSS v4, Lucide React, Framer Motion, Radix UI primitives
- **Data Visualization**: Recharts, SVG floorplan overlays
- **Build Tool**: Vite 7, PostCSS, ESBuild
- **Server Runtime**: Node.js, Express, TSX
- **Testing**: Vitest automated assertions
- **Package Manager**: PNPM / NPM

---

## 🏗 Architecture & Directory Structure

```
Smart-Warehouse-Ops/
├── client/
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── __tests__/        # Automated Vitest test suites
│   │   ├── components/       # Radix UI primitives & custom operations widgets
│   │   ├── contexts/         # Theme and operational state providers
│   │   ├── hooks/            # Custom hooks for responsiveness & state
│   │   ├── lib/              # Styling and calculation utility helpers
│   │   ├── pages/            # Home dashboard & operations viewports
│   │   ├── App.tsx           # Application route definitions
│   │   ├── index.css         # Tailwind CSS v4 styles & theme variables
│   │   └── main.tsx          # Client entrypoint
│   └── index.html            # HTML5 single-page application wrapper
├── server/
│   └── index.ts              # Production Express static & API server
├── shared/
│   └── const.ts              # Cross-boundary constants and schemas
├── patches/                  # Deterministic dependency patches
├── components.json           # Shadcn/Radix component configuration
├── package.json              # Dependencies and lifecycle scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build and plugin definitions
├── .env.example              # Environment variable template
├── .gitignore                # Node and build ignore definitions
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js `v20+` or `v24+`
- `pnpm` (`v9+` or `v10+`) or `npm` (`v10+`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chakriburidi237-crypto/Smart-Warehouse-Ops..git
   cd Smart-Warehouse-Ops.
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Automated Testing

Run the Vitest test suite to verify data contracts, flow calculations, and zone assertions:

```bash
npm run test
```

Expected output:
```
✓ client/src/__tests__/warehouse.test.ts (2 tests)
Test Files  1 passed (1)
     Tests  2 passed (2)
```

---

## 🚀 Production Build & Deployment

### Build Bundle

```bash
npm run build
```
This compiles the optimized Vite frontend bundle to `dist/public` and bundles the Express server using ESBuild.

### Run in Production

```bash
npm run start
```

### Deploy to Render / Railway / Docker

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 📄 License and Copyright\n\nAll rights reserved © 2026 Chakradhar Buridi.

