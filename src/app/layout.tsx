import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ]
};

export const metadata: Metadata = {
  title: {
    default: "ArguX - AI 기반 토론 플랫폼",
    template: "%s | ArguX"
  },
  description: "ArguX는 AI 기술을 활용한 차세대 토론 플랫폼입니다. 찬반 토론을 통해 인사이트를 나누고, 데이터 기반 의사결정을 지원합니다. 실시간 토론 참여, 인사이트 분석, 커뮤니티 참여를 경험해보세요.",
  keywords: [
    "토론",
    "debate",
    "찬반토론",
    "AI 토론",
    "인사이트",
    "의사결정",
    "커뮤니티",
    "실시간 토론",
    "데이터 분석",
    "ArguX",
    "토론 플랫폼",
    "온라인 토론"
  ],
  authors: [{ name: "ArguX Team" }],
  creator: "ArguX",
  publisher: "ArguX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: '/',
    title: "ArguX - AI 기반 토론 플랫폼",
    description: "ArguX는 AI 기술을 활용한 차세대 토론 플랫폼입니다. 찬반 토론을 통해 인사이트를 나누고, 데이터 기반 의사결정을 지원합니다.",
    siteName: "ArguX",
    images: [
      {
        url: "/assets/logo/argu_x_logo.png",
        width: 2000,
        height: 609,
        alt: "ArguX - AI 기반 토론 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArguX - AI 기반 토론 플랫폼",
    description: "ArguX는 AI 기술을 활용한 차세대 토론 플랫폼입니다. 찬반 토론을 통해 인사이트를 나누고, 데이터 기반 의사결정을 지원합니다.",
    images: ["/assets/logo/argu_x_logo.png"],
    creator: "@argux",
  },
  icons: {
    icon: [
      { url: "/assets/logo/argu_x_logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased px-3" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          {children}
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
