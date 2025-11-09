# Impressaa Application - Architecture Guide

This document provides a comprehensive overview of the Impressaa application architecture to help future Claude Code instances understand the codebase structure, patterns, and design decisions.

## Table of Contents

1. [Overview](#overview)
2. [Application Structure](#application-structure)
3. [Core Technologies & Patterns](#core-technologies--patterns)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Integration](#api-integration)
6. [Feature Organization](#feature-organization)
7. [Routing & Navigation](#routing--navigation)
8. [State Management](#state-management)
9. [Component Architecture](#component-architecture)
10. [Context Providers](#context-providers)
11. [Key Architectural Patterns](#key-architectural-patterns)

---

## Overview

**Impressaa** is a React 19 + TypeScript financial administration application built with modern tooling and architectural best practices. It's designed to be a **modular, type-safe, and scalable** system with support for **Module Federation** for micro-frontend architecture.

### Key Characteristics
- **Framework**: React 19 + TypeScript (5.8)
- **Router**: TanStack Router (v1.120.5) - file-based routing
- **State Management**: React Context + React Query (v5.76.1) for server state
- **Build Tool**: Vite 6 with Module Federation plugin
- **UI Library**: Radix UI components + Tailwind CSS 4
- **Form Handling**: React Hook Form + Zod (validation)
- **API Client**: Custom Axios wrapper with interceptor chain

---

## Application Structure

```
src/
├── api/                    # API client layer
│   ├── client/            # HTTP client & token management
│   ├── endpoints/         # API endpoint definitions
│   └── hooks/             # API-related custom hooks
├── components/            # Shared UI components
│   ├── ui/               # Base UI components (Radix UI wrapped)
│   ├── layout/           # Layout components
│   ├── elements/         # Complex composite elements
│   └── widgets/          # Reusable feature widgets
├── config/               # Configuration files
│   ├── env.ts            # Environment variables
│   ├── navigation.ts     # Navigation config
│   └── fonts.ts          # Font configuration
├── context/              # Global context providers
│   ├── auth-context.tsx
│   ├── theme-context.tsx
│   ├── color-theme-context.tsx
│   └── font-context.tsx
├── features/             # Feature modules (domain-driven)
│   ├── auth/            # Authentication flows
│   ├── dashboard/       # Dashboard feature
│   ├── institutions/    # Institutions management
│   ├── forms/          # Forms management
│   ├── submissions/    # Submissions handling
│   ├── templates/      # Templates management
│   ├── phases/         # Phases management
│   ├── products/       # Products management
│   ├── users/          # Users management
│   ├── settings/       # User settings
│   └── errors/         # Error pages
├── guards/              # Route guards
│   └── useAuthGuard.ts
├── hooks/               # Custom hooks
├── layouts/             # Page layouts
│   ├── dashboard/       # Dashboard layout
│   └── auth/           # Auth page layout
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx      # Root layout
│   ├── _authenticated.tsx # Auth guard layout
│   └── _authenticated/  # Protected routes
├── types/               # Global type definitions
├── utils/               # Utility functions
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

---

## Core Technologies & Patterns

### 1. **Vite + Module Federation**
- **Configured in**: `vite.config.ts`
- **Purpose**: Enables micro-frontend architecture
- **Exposed Modules**: `./App` is exposed as `remoteEntry.js`
- **Shared Dependencies**: React, React Router, TanStack Router/Query are configured as singletons to prevent duplicate instancing

```typescript
// vite.config.ts excerpt
federation({
  name: "impressaa",
  filename: "remoteEntry.js",
  exposes: { "./App": "./src/App.tsx" },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@tanstack/react-router": { singleton: true },
    "@tanstack/react-query": { singleton: true },
  },
})
```

### 2. **TanStack Router - File-Based Routing**
- **Route Tree Generated**: `routeTree.gen.ts` (auto-generated)
- **Routing Pattern**: File-system based with special prefixes
  - `_authenticated` = Layout route requiring auth
  - `(errors)` = Error routes
  - Nested folders = nested routes

**Key Route Structure**:
```
__root.tsx                           # Global root, dev tools setup
├─ _authenticated.tsx               # Auth guard + DashboardLayout
│  ├─ index.tsx                    # / (default route: Institutions)
│  ├─ institutions/
│  │  ├─ route.tsx                 # Layout outlet
│  │  ├─ index.tsx                 # List view
│  │  ├─ dashboard/
│  │  └─ submissions/
│  ├─ forms/
│  ├─ templates/
│  ├─ products/
│  ├─ phases/
│  ├─ users/
│  └─ settings/
├─ sign-in                         # Public routes
├─ sign-up
└─ (errors)/401.tsx               # Error fallback
```

### 3. **Context Providers Stack** (App.tsx)
```typescript
<QueryClientProvider>                    // React Query
  <ThemeProvider>                       // Dark/Light theme
    <ColorThemeProvider>                // Color scheme (blue)
      <FontProvider>                    // Font selection
        <AuthProvider>                  // Auth state
          <RouterProvider />
        </AuthProvider>
      </FontProvider>
    </ColorThemeProvider>
  </ThemeProvider>
</QueryClientProvider>
```

---

## Authentication & Authorization

### Authentication Flow

**1. Token Management** (`api/client/auth.ts`)
```typescript
class TokenManager {
  static setTokens(tokens: AuthTokens)     // Store access + refresh tokens
  static getAccessToken(): string | null
  static getRefreshToken(): string | null
  static clearTokens(): void
  static hasTokens(): boolean              // Check auth status
}
```

**2. Auth Context** (`context/auth-context.tsx`)
```typescript
interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login(tokens: { accessToken, refreshToken, expires_in })
  logout()
}
```

**3. Auth Guard** (`guards/useAuthGuard.ts`)
- Checks `TokenManager.hasTokens()` on startup
- Redirects to `/sign-in` if not authenticated
- Can be disabled via `env.isAuthGuardDisabled` for development
- Integrated at `_authenticated` route level

**4. Login Flow**
- User submits email/password to `authApi.login()`
- API returns access token + refresh token
- `TokenManager.setTokens()` stores tokens in localStorage
- `AuthProvider.login()` updates context state and redirects to `/`

**5. Token Refresh Strategy**
```typescript
// API Client Interceptors (api/client/axios.ts)
- Request interceptor: Adds "Authorization: Bearer {token}" header
- Response interceptor: Intercepts 401 errors
  - Queues failed requests
  - Attempts refresh using refreshToken
  - Replays queued requests with new token
  - On refresh failure: Clears tokens, dispatches "auth:logout" event
```

**6. Global Auth Logout Event**
```typescript
// When refresh fails or in AuthProvider
window.dispatchEvent(new CustomEvent("auth:logout"))
// Caught in AuthProvider useEffect → redirects to /sign-in
```

---

## API Integration

### Architecture Layers

**1. API Client** (`api/client/axios.ts`)
```typescript
class ApiClient {
  private client: AxiosInstance
  
  // Public methods for HTTP verbs
  async get<T>(url, config?)
  async post<T>(url, data, config?)
  async put<T>(url, data, config?)
  async patch<T>(url, data, config?)
  async delete<T>(url, config?)
  async uploadFile<T>(url, formData, config?)
  
  // Auth management
  setAuthToken(token)
  clearAuthToken()
}

export const apiClient = new ApiClient()
```

**2. Configuration**
```typescript
// Base URL from env
baseURL: env.apiBaseUrl  // VITE_API_BASE_URL
timeout: 10000
headers: { "Content-Type": "application/json" }
```

**3. Response/Error Types** (`api/client/types.ts`)
```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>  // Validation errors
}

interface PaginatedResponse<T> {
  data: T[]
  meta: { current_page, per_page, total, last_page }
}
```

**4. Endpoint Definitions** (`api/endpoints/`)
```typescript
// Example: api/endpoints/auth.ts
export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient.post<LoginResponse>("/auth/login", credentials),
  
  logout: () => apiClient.post("/auth/logout"),
  
  refresh: (refreshToken) =>
    apiClient.post("/auth/refresh", { refreshToken: refreshToken }),
}
```

**5. Custom Hooks** (`api/hooks/`)
```typescript
// Example: useLogin hook
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()  // From AuthProvider

  const loginUser = async (credentials: LoginRequest) => {
    // Makes API call, handles errors, updates auth context
  }

  return { loginUser, isLoading, error, clearError }
}
```

### Error Handling

**Request Errors Are Enhanced**:
```typescript
private handleError(error: AxiosError<ErrorResponse>): ApiError {
  const status = error.response?.status || 500
  const message = errorData?.message || errorData?.error || error.message
  const errors = errorData?.errors  // Validation field errors
  
  if (import.meta.env.DEV) {
    console.error("API Error:", { status, message, errors, url, method })
  }
  
  return { message, status, errors }
}
```

---

## Feature Organization

### Feature Module Pattern

Each feature follows a **self-contained module pattern**:

```
features/{feature-name}/
├── index.tsx                      # Main export component
├── context/
│   └── {feature}-context.tsx     # Feature state management
├── config/
│   ├── columns.tsx               # Table column definitions
│   ├── filters.ts                # Filter configurations
│   └── status-config.ts          # Status enums/mappings
├── components/
│   ├── {feature}-dialogs.tsx     # Dialog orchestration
│   ├── {feature}-form-modal.tsx
│   ├── {feature}-view-modal.tsx
│   ├── {feature}-delete-dialog.tsx
│   └── {feature}-primary-buttons.tsx
├── data/
│   ├── schema.ts                 # Zod schemas for type-safety
│   ├── data.ts                   # Mock/placeholder data
│   └── {feature}.ts              # Feature-specific data
└── hooks/                        # Feature-specific custom hooks
```

### Example: Institutions Feature

**1. Schema** (`features/institutions/data/schema.ts`)
```typescript
export const institutionSchema = z.object({
  id: z.string(),
  institutionCode: z.string(),
  name: z.string(),
  type: z.enum(["school", "office", "organization", "other"]),
  status: z.enum(["active", "inactive"]),
  // ... other fields
})

export type Institution = z.infer<typeof institutionSchema>
```

**2. Context** (`features/institutions/context/institutions-context.tsx`)
```typescript
interface InstitutionsContextType {
  // Dialog states
  addDialogOpen: boolean
  editDialogOpen: boolean
  deleteDialogOpen: boolean
  viewDialogOpen: boolean
  
  // Current row being operated on
  currentRow: Institution | null
  
  // Action handlers for table
  handleView(institution: Institution)
  handleEdit(institution: Institution)
  handleDelete(institution: Institution)
}

// Wraps feature component
export function InstitutionsProvider({ children })
export function useInstitutionsContext()
```

**3. Main Component** (`features/institutions/index.tsx`)
```typescript
export default function Institutions() {
  return (
    <InstitutionsProvider>
      <InstitutionsContent />
    </InstitutionsProvider>
  )
}

function InstitutionsContent() {
  const { handleView, handleEdit, handleDelete } = useInstitutionsContext()
  const tableState = useTableState<Institution>({
    debounceMs: 300,
    onStateChange: handleTableStateChange,
  })
  
  return (
    <div className="space-y-8">
      <h1>Institutions</h1>
      <DataTable
        data={institutionList}
        columns={columns}
        config={tableConfig}
        callbacks={tableCallbacks}
      />
      <InstitutionDialogs />
    </div>
  )
}
```

### Current Features Overview

| Feature | Purpose | Data Source | Key Components |
|---------|---------|-------------|-----------------|
| **auth** | Login, signup, password reset, OTP | API | SignIn, SignUp, ForgotPassword, OTP forms |
| **dashboard** | Institution progress & template selection | Mock data | ProgressDashboard, TemplateSelection |
| **institutions** | Manage institutions & their settings | Mock data | Institutions list, Add/Edit dialogs |
| **forms** | Manage forms for submissions | Mock data | Forms table, Form builder |
| **submissions** | View & manage form submissions | Mock data | Submissions table |
| **templates** | Manage submission templates | Mock data | Templates list |
| **phases** | Manage submission phases | Mock data | Phases management |
| **products** | Manage products | Mock data | Products list |
| **users** | User management | API hooks | Users table |
| **settings** | User preferences (theme, appearance, notifications) | Context providers | Account, Display, Appearance tabs |

---

## Routing & Navigation

### Navigation Configuration

**config/navigation.ts**
```typescript
export const mainNavItems: SidebarItem[] = [
  { label: "Institutions", path: "/institutions", icon: Building2 },
  { label: "Forms", path: "/forms", icon: FileText },
  { label: "Phases", path: "/phases", icon: Layers },
  { label: "Submissions", path: "/submissions", icon: FileCheck2 },
  // ...
]

// Dynamic navigation based on route
const getNavItems = (): SidebarItem[] => {
  const isInstitutionChildRoute = currentPath.startsWith("/institutions/")
  return isInstitutionChildRoute ? institutionNavItems : defaultNavItems
}
```

### Navigation Patterns

**Programmatic Navigation**
```typescript
// In components
const router = useRouter()
router.navigate({ to: "/institutions" })
```

---

## State Management

### Hierarchy

1. **Global Context State** (Providers in App.tsx)
   - Auth (authentication + token refresh)
   - Theme (dark/light mode)
   - ColorTheme (color scheme)
   - Font (typography)

2. **Feature Context State** (Scoped to feature)
   - Dialog states (open/closed)
   - Current row for CRUD operations
   - Feature-specific settings

3. **Server State** (React Query)
   - Currently unused but configured
   - Intended for API data caching
   - Configured: `staleTime: 60s, gcTime: 10min`

4. **Local Component State** (useState)
   - Form inputs
   - Table pagination/sorting/filtering
   - Temporary UI state

### Table State Management Pattern

**useTableState Hook** (`components/elements/app-data-table/hooks/use-table-state.ts`)
```typescript
interface TableState<T> {
  search: string
  filters: FilterValue[]
  sorting: SortingState
  pagination: PaginationState
  selection: T[]
}

interface TableStateConfig {
  debounceMs: number  // Debounce search changes
  onStateChange?: (state: TableState<T>) => void  // Notify of changes
}

export function useTableState<T>(config: TableStateConfig) {
  // Manages table UI state
  // Calls API on state change
  return {
    state: TableState<T>,
    updateSearch,
    updateFilters,
    updateSorting,
    updatePagination,
    updateSelection,
  }
}
```

---

## Component Architecture

### Atomic Design System

Components follow **atomic design** within the component library:

```
components/
├── atoms/                    # Smallest building blocks
│   └── (SearchInput, FilterBadge, ActionButton)
├── molecules/               # Groups of atoms
│   └── (ColumnHeader, TableToolbar, FacetedFilter, TablePagination)
├── organisms/              # Complex composites
│   └── (DataTable, DashboardLayout, AppNavbar)
└── ui/                     # Radix UI wrapped components
    └── (Button, Card, Dialog, Select, Checkbox, etc.)
```

### DataTable Component Architecture

**Purpose**: Reusable, configurable table component for CRUD operations

**Structure**:
```typescript
// Main export
<DataTable
  data={T[]}
  columns={ColumnDef<T>[]}
  config={DataTableConfig<T>}
  callbacks={DataTableCallbacks<T>}
/>

interface DataTableConfig {
  search?: { enabled, placeholder, columnKey }
  filters?: FilterConfig[]
  pagination?: { enabled, defaultPageSize }
  selection?: { enabled }
  sorting?: { enabled, defaultSort }
  viewOptions?: { enabled }
  emptyStateMessage?: string
  initialState?: { sorting, columnFilters, pagination, rowSelection }
}

interface DataTableCallbacks<T> {
  onSearch?(query: string)
  onFiltersChange?(filters: FilterValue[])
  onSortingChange?(sorting: SortingState)
  onRowSelectionChange?(selection: T[])
  onPaginationChange?(pagination: PaginationState)
}
```

### UI Components

Built on **Radix UI** with custom Tailwind styling:
- Button
- Card
- Dialog/Modal
- Dropdown Menu
- Select
- Checkbox
- Radio Group
- Switch
- Tabs
- Tooltip
- Alert Dialog
- Popover
- Separator
- Avatar
- Progress
- Scroll Area

---

## Context Providers

### 1. AuthProvider (`context/auth-context.tsx`)

**Responsibilities**:
- Checks token existence on mount
- Manages login/logout functions
- Listens for global auth:logout events
- Persists auth state through TokenManager

**API**:
```typescript
const { isAuthenticated, isLoading, login, logout } = useAuth()
```

### 2. ThemeProvider (`context/theme-context.tsx`)

**Responsibilities**:
- Manages dark/light/system theme
- Applies theme class to `<html>` element
- Listens to system color scheme preference
- Persists theme choice to localStorage

**API**:
```typescript
const { theme, setTheme } = useTheme()  // "dark" | "light" | "system"
```

### 3. ColorThemeProvider (`context/color-theme-context.tsx`)

**Responsibilities**:
- Manages color theme (currently only "blue")
- Applies CSS custom properties to document root
- Supports dark/light variants with OkLCH color values
- Applies chart colors (5 variations)

**Color Themes**:
```typescript
colorThemes = {
  blue: {
    light: { primary, primaryForeground, ring, ... },
    dark: { primary, primaryForeground, ring, ... }
  }
}
```

### 4. FontProvider (`context/font-context.tsx`)

**Responsibilities**:
- Manages available fonts from `config/fonts.ts`
- Applies `font-{name}` class to `<html>` element
- Persists font choice to localStorage

**API**:
```typescript
const { font, setFont } = useFont()
```

---

## Key Architectural Patterns

### 1. **Feature Module Pattern**

Each feature is self-contained with its own:
- State (context)
- Configuration (columns, filters)
- Components (dialogs, buttons)
- Data models (schemas, mock data)
- Hooks (feature-specific)

**Benefits**:
- Easy to move/remove features
- Clear dependencies
- Testable in isolation
- Scalable structure

### 2. **Data Flow Pattern**

```
User Interaction (Table/Form)
  ↓
Table State / Form State (useState)
  ↓
Feature Context (Dialog state, current row)
  ↓
API Call (if integrated)
  ↓
Response Handling / Error Handling
  ↓
Update UI State
```

### 3. **Dialog Orchestration Pattern**

Features typically use a dialog controller component:

```typescript
// FormDialogs.tsx - Central dialog management
function FormDialogs() {
  const {
    addDialogOpen, setAddDialogOpen,
    editDialogOpen, setEditDialogOpen,
    deleteDialogOpen, setDeleteDialogOpen,
    currentRow
  } = useFormsContext()
  
  return (
    <>
      <FormCreateDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <FormViewModal open={editDialogOpen} form={currentRow} onOpenChange={setEditDialogOpen} />
      <FormDeleteDialog open={deleteDialogOpen} form={currentRow} onOpenChange={setDeleteDialogOpen} />
    </>
  )
}
```

### 4. **Environment Configuration Pattern**

```typescript
// config/env.ts - Single source of truth
class Environment {
  private config: EnvironmentConfig
  
  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }
  
  private loadConfig(): EnvironmentConfig {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "...",
      DISABLE_AUTH_GUARD: import.meta.env.VITE_DISABLE_AUTH_GUARD === "true",
      ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === "true",
      // ...
    }
  }
  
  // Getter methods for type-safe access
  get apiBaseUrl(): string { return this.config.API_BASE_URL }
  get isAuthGuardDisabled(): boolean { return this.config.DISABLE_AUTH_GUARD }
}

export const env = new Environment()

// Usage
const url = env.apiBaseUrl
const authDisabled = env.isAuthGuardDisabled
```

### 5. **Type Safety with Zod**

Data validation at feature level:

```typescript
// Define schema
export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["active", "inactive"]),
  // ... fields
})

// Infer type from schema
export type Institution = z.infer<typeof institutionSchema>

// Validate at runtime
const institutionList = institutionListSchema.parse(data)
```

---

## Development & Configuration

### Environment Variables

Required (with defaults):
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Impressaa
VITE_APP_VERSION=1.0.0
```

Optional:
```
VITE_ENABLE_DEV_TOOLS=true        # Enable React Query/Router devtools
VITE_DISABLE_AUTH_GUARD=true      # Skip auth checks (dev only)
```

### Build & Development

```bash
npm run dev      # Start dev server on :5174
npm run build    # Build for production
npm run lint     # ESLint check
```

### Development Tools

In dev mode, two devtools appear:
- **React Query Devtools** (bottom-left)
- **TanStack Router Devtools** (bottom-right)

---

## Common Development Tasks

### Adding a New Feature

1. Create feature directory: `src/features/{feature-name}`
2. Create schema: `data/schema.ts` (use Zod)
3. Create context: `context/{feature}-context.tsx`
4. Create main component: `index.tsx`
5. Create route: `src/routes/_authenticated/{feature}/index.tsx`
6. Add navigation item: `config/navigation.ts`

### Adding a New API Endpoint

1. Create endpoint file: `src/api/endpoints/{resource}.ts`
2. Define request/response types
3. Create API functions using `apiClient`
4. Export from `src/api/endpoints/index.ts`
5. Create custom hook if needed: `src/api/hooks/{resource}/`

### Adding a Table Feature

1. Define columns: `config/columns.tsx` (use TanStack Table)
2. Define filters: `config/filters.ts`
3. Create schema: `data/schema.ts`
4. Use DataTable component with `useTableState`
5. Handle state changes in `handleTableStateChange` callback

---

## Production-Ready API Integration Patterns

### 1. Query Key Factory (CRITICAL)

**Location**: `src/api/query-keys.ts`

Centralized query key management prevents cache inconsistencies:

```typescript
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: GetUsersParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.users.details(), uuid] as const,
  },
  institutions: {
    all: ['institutions'] as const,
    lists: () => [...queryKeys.institutions.all, 'list'] as const,
    list: (params?: GetInstitutionsParams) => [...queryKeys.institutions.lists(), params] as const,
    details: () => [...queryKeys.institutions.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.institutions.details(), uuid] as const,
  },
};

// Usage
useQuery({
  queryKey: queryKeys.users.detail(uuid),
  queryFn: () => usersApi.getUserById(uuid),
});

// Invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
```

### 2. React Query Configuration

**Location**: `src/config/query-client.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 min (match backend CACHE_TTL)
      gcTime: 10 * 60 * 1000,          // 10 min garbage collection
      retry: 1,                         // Retry once on failure
      refetchOnWindowFocus: false,      // Don't refetch on focus
      refetchOnReconnect: true,         // Refetch on network reconnect
    },
    mutations: {
      retry: 0,                         // Never retry mutations
    },
  },
});
```

### 3. API Hooks with React Query

**Query Hook Pattern** (GET requests):

```typescript
// src/api/hooks/users/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getUsers(params),
  });
};

// Usage in component
const { data, isLoading, error, refetch } = useUsers({ page: 1, pageSize: 10 });
```

**Mutation Hook Pattern** (POST/PUT/PATCH/DELETE):

```typescript
// src/api/hooks/users/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/components/ui/use-toast';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      // Invalidate users list to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Usage in component
const createUser = useCreateUser();

const handleSubmit = async (data: CreateUserRequest) => {
  await createUser.mutateAsync(data);
};
```

### 4. Backend DTO Alignment with Zod

**IMPORTANT**: Match backend DTOs exactly (see backend CLAUDE.md)

```typescript
// src/types/dto/user.dto.ts
import { z } from 'zod';

// === REQUEST SCHEMAS (match backend) ===
export const CreateUserRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

// === RESPONSE SCHEMAS (match backend UserData) ===
export const UserDataSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserDataSchema>;

// === API RESPONSE WRAPPERS ===
export const UserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: UserDataSchema,
});

export const UsersListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(UserDataSchema),
});
```

### 5. API Endpoints with Version Prefix

**Pattern**: Always use `/v1` prefix to match backend

```typescript
// src/api/endpoints/users.ts
import { apiClient } from '@/api/client/axios';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/dto/user.dto';

const API_VERSION = '/v1';

export const usersApi = {
  getUsers: (params?: { page?: number; pageSize?: number; search?: string }) =>
    apiClient.get<User[]>(`${API_VERSION}/users`, { params }),

  getUserById: (uuid: string) =>
    apiClient.get<User>(`${API_VERSION}/users/${uuid}`),

  createUser: (data: CreateUserRequest) =>
    apiClient.post<User>(`${API_VERSION}/users`, data),

  updateUser: (uuid: string, data: UpdateUserRequest) =>
    apiClient.put<User>(`${API_VERSION}/users/${uuid}`, data),

  deleteUser: (uuid: string) =>
    apiClient.delete<void>(`${API_VERSION}/users/${uuid}`),
};
```

### 6. Optimistic Updates Pattern

For better UX, update UI before server responds:

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(uuid, data),

    // Before mutation
    onMutate: async ({ uuid, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(uuid) });

      // Snapshot previous value
      const previous = queryClient.getQueryData(queryKeys.users.detail(uuid));

      // Optimistically update
      queryClient.setQueryData(queryKeys.users.detail(uuid), (old: any) => ({
        ...old,
        data: { ...old.data, ...data },
      }));

      return { previous };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.users.detail(variables.uuid),
          context.previous
        );
      }
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.uuid) });
    },

    onSuccess: () => {
      toast({ title: 'Success', description: 'User updated successfully' });
    },
  });
};
```

### 7. Pagination with React Query

```typescript
export const useUsersPaginated = (params: GetUsersParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getUsers(params),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};

// Usage
const [page, setPage] = useState(1);
const { data, isLoading, isPlaceholderData } = useUsersPaginated({ page, pageSize: 10 });

// Show loading overlay if placeholder data is shown
{isPlaceholderData && <LoadingOverlay />}
```

### 8. Prefetching Pattern

Improve perceived performance by prefetching data:

```typescript
const queryClient = useQueryClient();

const prefetchUser = (uuid: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.users.detail(uuid),
    queryFn: () => usersApi.getUserById(uuid),
  });
};

// Usage
<Link
  to="/users/$uuid"
  params={{ uuid }}
  onMouseEnter={() => prefetchUser(uuid)}
>
  View User
</Link>
```

### 9. Global Error Handling

Create a centralized error handler:

```typescript
// src/lib/error-handler.ts
import { toast } from '@/components/ui/use-toast';
import { ApiError } from '@/api/client/types';

export const handleApiError = (error: ApiError) => {
  // Validation errors (400)
  if (error.status === 400 && error.errors) {
    const errorMessages = Object.entries(error.errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');

    toast({
      title: 'Validation Error',
      description: errorMessages,
      variant: 'destructive',
    });
    return;
  }

  // Unauthorized (401)
  if (error.status === 401) {
    toast({
      title: 'Unauthorized',
      description: 'Please log in again',
      variant: 'destructive',
    });
    return;
  }

  // Forbidden (403)
  if (error.status === 403) {
    toast({
      title: 'Access Denied',
      description: 'You don\'t have permission to perform this action',
      variant: 'destructive',
    });
    return;
  }

  // Not found (404)
  if (error.status === 404) {
    toast({
      title: 'Not Found',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  // Server error (500+)
  toast({
    title: 'Server Error',
    description: error.message || 'Something went wrong',
    variant: 'destructive',
  });
};

// Usage in hooks
onError: (error: ApiError) => {
  handleApiError(error);
}
```

### 10. Lazy Loading Routes

**Pattern**: Use `.lazy.tsx` for non-critical routes

```typescript
// src/routes/_authenticated/users/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: UsersPage,
});

function UsersPage() {
  // Component code
}
```

**Benefits**:
- Code splitting per route
- Faster initial load
- Better performance

### 11. Feature Integration Example

Complete example integrating all patterns:

```typescript
// 1. Define DTOs
// src/types/dto/institution.dto.ts
export const CreateInstitutionRequestSchema = z.object({
  institutionCode: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['school', 'office', 'organization', 'other']),
});

export type CreateInstitutionRequest = z.infer<typeof CreateInstitutionRequestSchema>;

export const InstitutionDataSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  institutionCode: z.string(),
  name: z.string(),
  type: z.string(),
  status: z.enum(['active', 'inactive']),
});

export type Institution = z.infer<typeof InstitutionDataSchema>;

// 2. Define endpoints
// src/api/endpoints/institutions.ts
export const institutionsApi = {
  getInstitutions: (params?: GetInstitutionsParams) =>
    apiClient.get<Institution[]>('/v1/institutions', { params }),

  getInstitutionById: (uuid: string) =>
    apiClient.get<Institution>(`/v1/institutions/${uuid}`),

  createInstitution: (data: CreateInstitutionRequest) =>
    apiClient.post<Institution>('/v1/institutions', data),

  updateInstitution: (uuid: string, data: Partial<CreateInstitutionRequest>) =>
    apiClient.put<Institution>(`/v1/institutions/${uuid}`, data),

  deleteInstitution: (uuid: string) =>
    apiClient.delete<void>(`/v1/institutions/${uuid}`),
};

// 3. Add query keys
// src/api/query-keys.ts
institutions: {
  all: ['institutions'] as const,
  lists: () => [...queryKeys.institutions.all, 'list'] as const,
  list: (params?: GetInstitutionsParams) => [...queryKeys.institutions.lists(), params] as const,
  details: () => [...queryKeys.institutions.all, 'detail'] as const,
  detail: (uuid: string) => [...queryKeys.institutions.details(), uuid] as const,
},

// 4. Create hooks
// src/api/hooks/institutions/useInstitutions.ts
export const useInstitutions = (params?: GetInstitutionsParams) => {
  return useQuery({
    queryKey: queryKeys.institutions.list(params),
    queryFn: () => institutionsApi.getInstitutions(params),
  });
};

// src/api/hooks/institutions/useCreateInstitution.ts
export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionsApi.createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions.lists() });
      toast({ title: 'Institution created successfully' });
    },
    onError: handleApiError,
  });
};

// 5. Use in component
// src/features/institutions/index.tsx
function InstitutionsContent() {
  const { data, isLoading, error } = useInstitutions();
  const createInstitution = useCreateInstitution();

  const handleCreate = async (data: CreateInstitutionRequest) => {
    await createInstitution.mutateAsync(data);
    setAddDialogOpen(false);
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      config={tableConfig}
    />
  );
}
```

## Notes for Future Development

### Current State
- Most data is **mock data** (not connected to API)
- Features have TODO comments where API integration is needed
- Table state management is ready for API integration
- Dialog orchestration is established but actions are mostly stub implementations

### Migration Path to Real API
1. Create query keys factory (`src/api/query-keys.ts`)
2. Create Zod DTOs matching backend exactly (`src/types/dto/*.dto.ts`)
3. Update API endpoints to use `/v1` prefix
4. Refactor all API hooks to use React Query (`useMutation`, `useQuery`)
5. Replace mock data with API hooks in features
6. Add error handling with toast notifications
7. Implement optimistic updates for mutations
8. Add route-based lazy loading

### Scalability Considerations
- **Module Federation**: Can split large features into separate micro-frontends
- **Context nesting**: Current pattern can scale; consider Redux if state gets complex
- **React Query**: Handles all server state caching, reduces API calls
- **Component library**: Strong foundation with Radix UI; can create design system

### Critical Best Practices for API Integration

1. **Always use queryKeys factory** - Never hardcode query keys
2. **Match backend DTOs exactly** - Use Zod schemas from backend CLAUDE.md
3. **Use `/v1` prefix** - Prepare for API versioning
4. **Invalidate on mutations** - Keep cache fresh
5. **Handle errors globally** - Use centralized error handler
6. **Show loading states** - Use `isLoading`, `isPending` from React Query
7. **Optimistic updates** - For better UX on mutations
8. **Lazy load routes** - Use `.lazy.tsx` for code splitting
9. **Prefetch on hover** - Improve perceived performance
10. **Type everything** - No `any` types, use Zod inferred types

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