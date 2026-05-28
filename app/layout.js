import './globals.css'

export const metadata = {
  title: 'Design Sparring',
  description: 'Stress-test your design decisions. Three rounds. A scored verdict. No encouragement.',
  icons: [
    { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
  ],
  openGraph: {
    title: 'Design Sparring',
    description: 'Paste your design rationale. Get a structured counter-argument.',
    url: 'https://design-sparring.org',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}