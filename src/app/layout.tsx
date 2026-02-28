import Providers from "./providers"
import Navbar from "@/components/Navbar"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-muted/40 antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-4xl mx-auto px-6 py-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}