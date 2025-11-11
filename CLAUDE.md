# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Agent Behavior
- All answers, code, and explanations must be delivered in chat, not as external files unless explicitly requested.
- Always provide code and explanations incrementally, in logically structured steps. Do not send complete implementations or entire files in one message. Also donnot create unwanted explanation md files.
- For each step, briefly cover:
  - What is being done
  - Why this approach is chosen (mention alternatives if relevant)
  - Any key tradeoffs
- Explanations must be minimal but clear—use concise, simple language. Avoid unnecessary comments, repetition, or filler.
- Assume the developer reading is entry-level, prefers hands-on, learn-by-doing guidance, and seeks practical best practices.
- All code must follow clean architecture, be modular, maintainable, and scalable.
- Strictly apply DRY, SOLID, and KISS principles.
- Always prioritize performance, stability, and production-readiness.
- Be serious, we are developing a production grade, enterpirse level app, so make sure the code quality.
- Every solution should aim to reduce bugs, improve clarity, and optimize for long-term maintainability.
- Very important: Avoid over-engineered or highly abstracted patterns unless justified by the project context.
- Always try to give necessary response only, to save tokens and extend sessions more, thus avoid hitting limit faster.

---

## **Project: Unit Communication Portal (Unit Comn Portal)**

### **Purpose**
A web-based communication platform for an army unit to centralize announcements, messaging, resource sharing, and feedback within the unit.

---

## **Core Features Breakdown**

### **PART I - Core Functionalities**

**5.1 Functionalities:**
- Announcements of major events, programs & postings
- Sending messages
- Sharing resources

**5.2 User Roles:**
- **Adjt** - Full control over the portal
- **IT JCO** - Manage content and users  
- **Users** - Access and interact with content

---

### **PART II - Main Features (Cases)**

**6.1** Login for different user roles (Adjt, IT JCO, User)  
**6.2** Overview of communication logs  
**6.3** Daily/Weekly message summaries  
**6.4** Pending message alerts  
**6.5** User activity tracking  
**6.6** Group and individual messaging  
**6.7** Resource upload/download  
**6.8** Event calendar  
**6.9** Password Reset - Allows users to reset passwords if forgotten  
**6.10** User Profile Management - Update profile information  
**6.11** Notification Settings - Customize notification preferences

---

### **PART III - Desired Outputs**

**7.1** Real-time notifications for new messages/announcements  
**7.2** Read receipts to know who has seen important updates  
**7.3** Feedback forms for suggestions or issue reporting  
**7.4** Downloadable communication summaries  
**7.5** Automatic reminders for upcoming events/deadlines  
**7.6** Secure document sharing with access controls  
**7.7** Analytics dashboard showing communication trends and user engagement  
**7.8** Archive of past announcements and messages  
**7.9** Option to mark messages as important/urgent

---

## **Pages We Need to Build**

Based on the requirements, here are the pages:

### **Public Pages**
1. **Login Page** - Multi-role login (Adjt/IT JCO/User)
2. **Password Reset Page** - Forgot password flow

### **Dashboard Pages (Post-Login)**
3. **Dashboard/Home** - Overview with stats, pending alerts, recent activity
4. **Communication Logs** - View all messages/announcements history
5. **Messages Page** 
   - Inbox/Sent/Drafts
   - Individual & Group messaging
   - Mark as important/urgent
6. **Announcements Page** - Create/View/Manage announcements
7. **Resources Page** - Upload/Download/Share documents
8. **Event Calendar** - View/Create/Manage events with reminders
9. **Analytics Dashboard** - Communication trends, user engagement metrics
10. **User Activity Tracking** - Monitor user interactions
11. **User Profile Page** - Update personal information
12. **Notification Settings** - Customize notification preferences

### **Admin Pages (Adjt/IT JCO only)**
13. **User Management** - Add/Edit/Delete users, assign roles
14. **Pending Approvals** - Review pending messages/resources
15. **Communication Summaries** - Generate daily/weekly reports

---

## Essential Commands

```bash
# Development
npm run dev      # Start dev server at http://localhost:5174
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build
npm run lint     # Run ESLint

# First Time Setup
cp .env.example .env  # Copy and configure environment variables
```

## Environment Setup

**Required**: Copy `.env.example` to `.env` and configure:

```bash
VITE_API_BASE_URL=http://localhost:8000/api  # Backend API URL
VITE_API_VERSION=/v1                         # API version prefix
VITE_DISABLE_AUTH_GUARD=true                 # Skip auth in development
VITE_ENABLE_DEV_TOOLS=true                   # Show React Query/Router devtools
```

---

## Technology Stack

- **React 19** + **TypeScript 5.8**
- **Vite 6** with Module Federation (micro-frontend support)
- **TanStack Router** (file-based routing)
- **React Query** (server state management)
- **Radix UI** + **Tailwind CSS 4**
- **React Hook Form** + **Zod** (forms + validation)
- **Axios** (HTTP client with interceptors)

---

## Architecture Overview

### Project Structure

```
src/
├── api/              # API layer (client, endpoints, hooks)
├── components/       # Shared UI (ui/, layout/, elements/)
├── config/           # Configuration (env, navigation, fonts)
├── context/          # Global providers (auth, theme, color, font)
├── features/         # Feature modules (domain-driven)
├── guards/           # Route guards (authentication)
├── layouts/          # Page layouts
├── routes/           # TanStack Router files
├── types/            # Global TypeScript types
└── utils/            # Utility functions
```

### Context Provider Stack

Providers wrap the app in this order (see `App.tsx`):
```
QueryClientProvider → ThemeProvider → ColorThemeProvider
  → FontProvider → AuthProvider → RouterProvider
```

---

## Key Architectural Patterns

### 1. File-Based Routing (TanStack Router)

- Routes in `src/routes/` map to URLs
- `__root.tsx` = global root layout
- `_authenticated.tsx` = layout requiring authentication
- `_authenticated/{feature}/` = protected feature routes
- Route tree auto-generated in `routeTree.gen.ts`

**Navigation conventions:**
- `_authenticated` prefix = auth-protected layout routes
- `(errors)` folder = error page routes

### 2. Feature Module Pattern

Each feature is self-contained in `features/{name}/`:

```
features/{feature-name}/
├── index.tsx                     # Main component
├── context/{feature}-context.tsx # Dialog state, current row
├── config/
│   ├── columns.tsx              # Table column definitions
│   └── filters.ts               # Filter configurations
├── components/
│   ├── {feature}-dialogs.tsx    # Dialog orchestrator
│   └── {feature}-form-modal.tsx
├── data/
│   ├── schema.ts                # Zod schema + TypeScript types
│   └── data.ts                  # Mock data (temporary)
└── hooks/                       # Feature-specific hooks
```

**Pattern:**
1. Define Zod schema in `data/schema.ts`, infer TypeScript type
2. Context manages dialog states + current row for CRUD
3. Main component wraps content in Provider
4. Dialog orchestrator renders all dialogs from context state

### 3. Authentication Flow

**Token Management** (`api/client/auth.ts`)
- `TokenManager` class stores access + refresh tokens in localStorage
- Methods: `setTokens()`, `getAccessToken()`, `clearTokens()`, `hasTokens()`

**Auth Guard** (`guards/useAuthGuard.ts`)
- Checks tokens on mount, redirects to `/sign-in` if missing
- Bypass in dev: `VITE_DISABLE_AUTH_GUARD=true`

**Token Refresh** (`api/client/axios.ts`)
- Request interceptor adds `Authorization: Bearer {token}` header
- Response interceptor catches 401 errors
- Auto-refreshes token and replays failed requests
- On refresh failure: clears tokens, dispatches `auth:logout` event

### 4. API Integration

**API Client** (`api/client/axios.ts`)
- Singleton `ApiClient` class wraps Axios
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`, `uploadFile()`
- Base URL from `env.apiBaseUrl`, 10s timeout
- Error handler transforms to `ApiError` with field-level validation

**Endpoints** (`api/endpoints/`)
- Organized by resource (e.g., `auth.ts`, `users.ts`)
- Always use `/v1` prefix for API versioning
- Example: `authApi.login()`, `usersApi.getUsers(params)`

**Hooks** (`api/hooks/`)
- Use React Query for GET (queries) and mutations
- Pattern: `const { data, isLoading, error } = useUsers(params)`
- Mutations: `useMutation` with `onSuccess` invalidating query cache

**Types** (`api/client/types.ts`)
- `ApiResponse<T>`: `{ success, data, message?, errors? }`
- `ApiError`: `{ message, status, errors? }`
- `PaginatedResponse<T>`: `{ data[], meta }`

### 5. State Management Hierarchy

1. **Global** (Context): Auth, Theme, ColorTheme, Font
2. **Feature** (Feature Context): Dialog states, current row
3. **Server** (React Query): API cache, 5min stale time, 10min GC
4. **Local** (useState): Form inputs, table state

### 6. React Query Patterns

**Query Keys** (`api/query-keys.ts`)
- Centralized factory prevents cache inconsistencies
- Hierarchical structure: `queryKeys.users.list(params)`
- Use for queries and invalidation

**Configuration** (`config/query-client.ts`)
- `staleTime: 5min`, `gcTime: 10min`, `retry: 1`
- Mutations never retry

**Usage:**
- Queries: `useQuery({ queryKey, queryFn })`
- Mutations: `useMutation({ mutationFn, onSuccess, onError })`
- Invalidate cache after mutations: `queryClient.invalidateQueries({ queryKey })`

---

## Development Workflow

### Adding a New Feature

1. Create `features/{name}/` with schema, context, components, config
2. Create route: `routes/_authenticated/{name}/index.tsx`
3. Add to sidebar: `config/navigation.ts`

### Adding API Endpoint

1. Create `api/endpoints/{resource}.ts` with API functions using `apiClient`
2. Add query keys to `api/query-keys.ts`
3. Create React Query hooks in `api/hooks/{resource}/`
4. Use DTOs from `types/dto/` matching backend exactly

### Working with Tables

1. Define columns in `config/columns.tsx` (TanStack Table)
2. Define filters in `config/filters.ts`
3. Create Zod schema in `data/schema.ts`
4. Use `<DataTable>` component with `useTableState` hook

---

## Important Notes

### Current State
- Most features use **mock data** (not connected to API yet)
- Auth and Users features have API integration examples
- Table state management ready for API integration

### Module Federation
- App exposed as `remoteEntry.js` at `vite.config.ts`
- Shared singletons: React, React Router, TanStack Router/Query
- Enables micro-frontend architecture

### Development Tools
- React Query Devtools (bottom-left, dev mode)
- TanStack Router Devtools (bottom-right, dev mode)
- Enable via `VITE_ENABLE_DEV_TOOLS=true`

### Type Safety
- All schemas use Zod with inferred TypeScript types
- No `any` types - use Zod schemas for runtime validation
- DTOs in `types/dto/` must match backend exactly

