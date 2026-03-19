import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { routeTree } from "./routes/routesTree";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

// Clear old persist cache from localStorage
localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 10, // 10 minutes
      staleTime: 1000 * 30, // 30 seconds
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: true,
    },
  },
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ErrorBoundary>
);