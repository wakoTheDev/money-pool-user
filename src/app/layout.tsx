import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Optimize font loading with better performance settings
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
  fallback: ['system-ui', 'arial'], // Better fallback fonts
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only preload if needed
  fallback: ['Courier New', 'monospace'],
});

export const metadata: Metadata = {
  title: "MoneyPool - Chama Management System",
  description: "Complete digital platform for Kenyan savings groups. Manage members, track contributions, process loans, and ensure transparency.",
  keywords: ["chama", "savings group", "financial management", "Kenya", "microfinance", "digital banking", "money management"],
  authors: [{ name: "MoneyPool Team" }],
  creator: "MoneyPool Team",
  publisher: "MoneyPool",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  robots: "index, follow",
  openGraph: {
    title: "MoneyPool - Chama Management System",
    description: "Complete digital platform for Kenyan savings groups. Manage members, track contributions, process loans, and ensure transparency.",
    type: "website",
    locale: "en_US",
    siteName: "MoneyPool",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyPool - Chama Management System",
    description: "Complete digital platform for Kenyan savings groups",
  },
  // Performance and accessibility optimizations
  other: {
    'theme-color': '#2E7D32',
    'color-scheme': 'light',
    'format-detection': 'telephone=no', // Prevent automatic phone number detection
  },
};

// Optimize viewport meta tag for better mobile performance
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/assets/logo.png" as="image" type="image/png" />
        
        {/* Critical CSS inline for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset and base styles */
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              background-color: #fafafa;
              color: #1f2937;
              font-synthesis: none;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Loading spinner optimization */
            .loading-spinner { 
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 3px solid #f3f3f3;
              border-top: 3px solid #2E7D32;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              will-change: transform;
            }
            
            /* Spin animation */
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Optimized scrollbar styles */
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            /* Focus styles for accessibility */
            .focus-visible {
              outline: 2px solid #2E7D32;
              outline-offset: 2px;
            }
            
            /* Reduce motion for accessibility */
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
              :root {
                --bg-color: #0f172a;
                --text-color: #f1f5f9;
              }
            }
          `
        }} />
        
        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MoneyPool",
              "applicationCategory": "BusinessApplication",
              "description": "Complete digital platform for Kenyan savings groups",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen`}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#2E7D32] text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
        >
          Skip to main content
        </a>
        
        {/* Main content wrapper with proper accessibility */}
        <div id="main-content" role="main" aria-label="Main application content">
          {children}
        </div>
        
        {/* Performance monitoring script placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Placeholder for analytics/monitoring
                console.log('MoneyPool loaded successfully');
              `
            }}
          />
        )}
      </body>
    </html>
  );
}
