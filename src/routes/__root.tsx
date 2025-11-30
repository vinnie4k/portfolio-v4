import NotFound from "@/features/notfound/NotFound";
import LanguageSync from "@/shared/components/LanguageSync";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Vin Bui",
      },
      {
        name: "description",
        content:
          "Vin Bui - Founding engineer at Nowadays (YC S23) and fourth-year student at Cornell University studying Information Science. Building products where good design and good tech meet.",
      },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/Nunito-VariableFont_wght.ttf",
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        href: "/fonts/LiebeHeide-Color.otf",
        as: "font",
        type: "font/otf",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/images/hero-1.webp",
        as: "image",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        href: appCss,
        as: "style",
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = ${JSON.stringify(appCss)};
                link.media = 'print';
                link.onload = function() { this.media = 'all'; };
                document.head.appendChild(link);
              })();
            `,
          }}
        />
        <noscript>
          <link rel="stylesheet" href={appCss} />
        </noscript>
      </head>
      <body>
        <LanguageSync />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
