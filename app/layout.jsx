import Navbar from '@/components/_layout/navbar';
import './globals.scss';

export const metadata = {
  title: 'Vertical Hub',
  description: 'Comunidad de escalada indoor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}