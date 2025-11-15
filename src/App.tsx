import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./context/theme-context";
import { FontProvider } from "./context/font-context";
import { AuthProvider } from "./context/auth-context";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
      // Global error handler for mutations
      onError: (error) => {
        console.error("[QueryClient] Mutation error:", error);
        // Errors already handled by axios interceptor
      },
    },
  },
});

// Generic detection: Check if running as microfrontend
const isEmbedded = window.__MICRO_FRONTEND_MODE__ || false;

// Create the router instance with context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    isEmbedded
  },
  basepath: isEmbedded ? "/ucp" : "/",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ucp-ui-theme">
        <FontProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </FontProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
