import './globals.css'

export const metadata = {
  title: 'Design Sparring',
  description: 'Stress-test your design decisions. Three rounds. A scored verdict. No encouragement.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Design Sparring',
    description: 'Paste your design rationale. Get a structured counter-argument.',
    url: 'https://design-sparring.org',
    siteName: 'Design Sparring',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
      </head>
      <body>{children}</body>
    </html>
  )
}