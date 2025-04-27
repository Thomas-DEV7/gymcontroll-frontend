import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
  title: 'GymControll',
  description: 'Sistema de gestão de treinos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
