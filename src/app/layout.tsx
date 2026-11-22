import type { Metadata } from 'next';
import { EB_Garamond } from 'next/font/google';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';
import './globals.css';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site';

const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-garamond',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Olu Bashorun & Co | Law Firm in Lekki, Lagos', template: '%s | Olu Bashorun & Co' },
  description:
    'Olu Bashorun & Co advises businesses, individuals and families on corporate, energy, property, family, data protection and AI matters from Lekki, Lagos.',
  themeColor: '#1a2440',
  alternates: { types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_NG',
    title: 'Olu Bashorun & Co | Law Firm in Lekki, Lagos',
    description:
      'Olu Bashorun & Co advises businesses, individuals and families on corporate, energy, property, family, data protection and AI matters from Lekki, Lagos.',
    url: '/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olu Bashorun & Co | Law Firm in Lekki, Lagos',
    description:
      'Olu Bashorun & Co advises businesses, individuals and families on corporate, energy, property, family, data protection and AI matters from Lekki, Lagos.',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

// Turn on the scroll-reveal styles before first paint (skipped for reduced motion).
const motionScript =
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)document.documentElement.classList.add('motion')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={garamond.variable} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/lagos-island-1280.jpg"
          imageSrcSet="/images/lagos-island-960.jpg 960w, /images/lagos-island-1280.jpg 1280w"
          imageSizes="(max-width:760px) 100vw, 64vw"
        />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body data-view="firm">{children}</body>
    </html>
  );
}
