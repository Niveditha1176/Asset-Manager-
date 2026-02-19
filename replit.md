# FleetDrive - Urban Logistics Driver App

## Overview

FleetDrive is a mobile-first urban logistics driver application built with Expo (React Native) and an Express.js backend. It serves as a high-fidelity prototype for delivery drivers, providing route management, delivery tracking, compliance reporting, and HR operations. The app features a dashboard with categorized task lists (en route, upcoming, completed), a map view with bottom sheet order details, delivery proof capture, exception reporting, fuel logging, leave/overtime forms, and a notification center with swipe gestures. A simulated "Voice Bot" FAB and urgent order overlay system demonstrate real-time dispatch interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router with file-based routing. Tab navigation lives in `app/(tabs)/` with four tabs: Home (index), Map, Notifications (Alerts), and Forms. Stack screens for delivery-proof, exception, fuel-log, urgent-order, profile, and settings are defined in `app/_layout.tsx`
- **State Management**: React Context (`lib/app-context.tsx`) manages global app state including orders, notifications, fuel/break requests, urgent order overlays, and voice bot messages. No Redux or Zustand — just Context + useState
- **Data Fetching**: TanStack React Query is set up (`lib/query-client.ts`) with a custom `apiRequest` helper that targets the Express backend via `EXPO_PUBLIC_DOMAIN`. Currently the app uses mock data (`lib/mock-data.ts`) for all orders, notifications, and driver info
- **Animations**: react-native-reanimated for pulsing dots, sliding sheets, shimmer effects, and urgent order overlay animations
- **Gestures**: react-native-gesture-handler for swipe-to-dismiss notifications
- **UI Libraries**: @expo/vector-icons (Feather, Ionicons), expo-blur, expo-haptics for tactile feedback, expo-image-picker for photo capture, expo-linear-gradient
- **Fonts**: Inter font family (400, 500, 600, 700 weights) via @expo-google-fonts/inter
- **Color System**: Centralized in `constants/colors.ts` — Primary Blue (#2563EB), White, Light Grey, with semantic colors for success, warning, danger, orange
- **Platform Handling**: Conditional code for web vs native (haptics guards, keyboard handling via `KeyboardAwareScrollViewCompat`, platform-specific insets)

### Backend (Express.js)

- **Runtime**: Node.js with Express 5, written in TypeScript (`server/index.ts`)
- **API Pattern**: Routes registered in `server/routes.ts` with `/api` prefix convention. Currently minimal — the route file creates an HTTP server but has no application routes yet
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`. Currently uses `MemStorage` (in-memory Map) for users. Designed to be swapped for database-backed implementation
- **CORS**: Dynamic CORS setup supporting Replit dev/deployment domains and localhost origins for Expo web development
- **Build**: Server builds with esbuild (`server:build` script) to `server_dist/`
- **Static Serving**: Production mode serves Expo web static build; landing page template at `server/templates/landing-page.html`

### Database Schema (Drizzle ORM + PostgreSQL)

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — currently only a `users` table with `id` (UUID, auto-generated), `username` (unique text), and `password` (text)
- **Validation**: drizzle-zod generates Zod schemas from Drizzle table definitions (`insertUserSchema`)
- **Migrations**: Output to `./migrations/` directory, managed via `drizzle-kit push` command
- **Connection**: Expects `DATABASE_URL` environment variable for PostgreSQL connection

### Key Design Decisions

1. **Mock data first**: All UI screens work with mock data from `lib/mock-data.ts`, making the frontend fully functional without backend API calls. This allows rapid UI iteration
2. **Shared schema**: The `shared/` directory contains types and schemas used by both frontend and backend, ensuring type consistency
3. **Context over Redux**: Simple React Context handles all state since this is a prototype without complex state interactions
4. **Urgent order simulation**: A timer in AppContext triggers an urgent order overlay after 6 seconds to demo real-time dispatch features
5. **File-based routing**: expo-router's file system routing with typed routes (`experiments.typedRoutes: true`) provides type-safe navigation

## External Dependencies

### Infrastructure
- **PostgreSQL**: Database backing, connected via `DATABASE_URL` environment variable. Drizzle ORM handles schema and queries
- **Replit**: Deployment platform — CORS, domain handling, and build scripts are Replit-aware (`REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, `REPLIT_INTERNAL_APP_DOMAIN`)

### Key NPM Packages
- **expo** (~54.0.27): Core mobile framework
- **expo-router** (~6.0.17): File-based navigation
- **express** (^5.0.1): Backend HTTP server
- **drizzle-orm** (^0.39.3) + **drizzle-kit**: Database ORM and migration tool
- **@tanstack/react-query** (^5.83.0): Server state management
- **react-native-reanimated** (~4.1.1): Animations
- **react-native-gesture-handler** (~2.28.0): Touch gestures
- **react-native-maps** (^1.18.0): Map component (referenced in map tab)
- **pg** (^8.16.3): PostgreSQL client
- **zod** + **drizzle-zod**: Runtime validation
- **expo-image-picker**: Camera/gallery access for proof photos
- **expo-haptics**: Tactile feedback on interactions
- **expo-location**: Location services
- **patch-package**: Applies patches on postinstall