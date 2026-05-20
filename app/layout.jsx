import Navbar from '@/components/_layout/navbar';
import Footer from '@/components/_layout/footer';
import { AuthProvider } from '@/context/AuthContext';
import './globals.scss';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}