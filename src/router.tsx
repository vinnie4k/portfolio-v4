import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { TranslatorProvider } from "eqqo-react";
import { PostHogProvider } from "posthog-js/react";
import { routeTree } from "./routeTree.gen";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
} as const;

export const getRouter = () => {
  const queryClient = new QueryClient();
  const rqContext = { queryClient };

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: "intent",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TranslatorProvider
          publicKey={import.meta.env.VITE_PUBLIC_EQQO_KEY}
          defaultLanguage="en"
        >
          <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={options}
          >
            <QueryClientProvider client={queryClient}>
              {props.children}
            </QueryClientProvider>
          </PostHogProvider>
        </TranslatorProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
