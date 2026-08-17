import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "@navikt/ds-css";
import "./index.css";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
  queryClient: QueryClient;
}

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient } as RouterContext,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Fant ikke root-element");
}

ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
