import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import PageTransition from "@/app/components/PageTransition";

const sharedStylesheets = [
  "/assets/styles.css",
  "/assets/styles-tablet.css",
  "/assets/styles-mobile.css",
  "/assets/styles-mobile-small.css",
  "/assets/styles-mobile-extra-small.css",
];

export const metadata: Metadata = {
  title: "Welcome 10th Batch - University Welcome Portal",
  description: "Welcome to the family! Interactive portal for new students with quiz, Q&A, and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-app-loading="true">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {sharedStylesheets.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style>{`
          html[data-app-loading="true"] {
            overflow: hidden;
          }

          html[data-app-loading="true"] body {
            overflow: hidden;
          }

          #app-loading-screen {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(circle at top, rgba(201, 162, 39, 0.18), transparent 42%),
              radial-gradient(circle at bottom, rgba(0, 180, 216, 0.12), transparent 36%),
              linear-gradient(180deg, #040404 0%, #0a0a0a 100%);
            color: #f6f1df;
          }

          html[data-app-loading="true"] #app-loading-screen {
            display: flex;
          }

          #app-loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          #app-loading-spinner {
            width: 58px;
            height: 58px;
            border-radius: 999px;
            border: 3px solid rgba(255, 255, 255, 0.12);
            border-top-color: #c9a227;
            border-right-color: rgba(0, 180, 216, 0.55);
            animation: appSpin 0.9s linear infinite;
            box-shadow: 0 0 24px rgba(201, 162, 39, 0.22);
          }

          #app-loading-copy {
            font-size: 0.78rem;
            color: rgba(255, 255, 255, 0.78);
          }

          #app-root-content {
            min-height: 100vh;
          }

          html[data-app-loading="true"] #app-root-content {
            visibility: hidden;
          }

          @keyframes appSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const root = document.documentElement;
              const finish = () => root.setAttribute('data-app-loading', 'false');

              if (document.readyState === 'complete') {
                finish();
                return;
              }

              window.addEventListener('load', finish, { once: true });
            })();`,
          }}
        />
      </head>
      <body>
        <div id="app-loading-screen" aria-label="Loading application" role="status" aria-live="polite">
          <div id="app-loading-content">
            <div id="app-loading-spinner" />
            <div id="app-loading-copy">Loading experience</div>
          </div>
        </div>

        <div id="app-root-content">
          <PageTransition />
          {children}
        </div>
      </body>
    </html>
  );
}