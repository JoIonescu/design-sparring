import './globals.css'

export const metadata = {
  title: 'Design Sparring',
  description: 'Stress-test your design decisions. Three rounds. A scored verdict. No encouragement.',
  openGraph: {
    title: 'Design Sparring',
    description: 'Paste your design rationale. Get a structured counter-argument.',
    url: 'https://designsparring.vercel.app',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Roboto:wght@400;500&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
