# GEMINI.md

## Project Overview

This is a React-based web application named "impressaa". It is built with Vite and TypeScript. The application uses a modern tech stack, including:

*   **UI Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **UI Components:** A combination of Radix UI, shadcn/ui, and custom components.
*   **Styling:** Tailwind CSS
*   **Routing:** TanStack Router
*   **Data Fetching:** TanStack Query with Axios
*   **Forms:** React Hook Form with Zod for validation

A key architectural feature is its use of **Module Federation**. The application is configured as a "remote" and exposes its main `App` component. This allows it to be loaded as a microfrontend within a larger "host" application. The code includes logic to adapt its behavior (e.g., router base path) when running in an embedded context.

## Building and Running

### Development

To run the application in development mode:

```bash
pnpm dev
```

This will start the Vite development server, typically on port `5174`.

### Building for Production

To build the application for production:

```bash
pnpm build
```

This will create a `dist` directory with the optimized and transpiled code.

### Linting

To check the code for linting errors:

```bash
pnpm lint
```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** The project uses a combination of Radix UI primitives and shadcn/ui components. New components should follow this pattern.
*   **State Management:** For server state, use TanStack Query. For client state, use React context or other appropriate state management libraries.
*   **Routing:** Routing is managed by TanStack Router. Route definitions are generated in `src/routeTree.gen.ts`.
*   **API:** API requests are handled by Axios, with TanStack Query for caching and state management.
*   **Microfrontend:** The application is designed to be a microfrontend. Be mindful of this when adding new features or dependencies.
