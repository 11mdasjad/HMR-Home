import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';

export const metadata = {
  title: 'HMR Hostel | Safe • Affordable • Comfortable Student Living',
  description: 'Premium student accommodation with modern rooms, healthy gourmet dining, 24/7 security, high-speed Wi-Fi, and a vibrant community. Near major NCR colleges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-primary-soft text-neutral-800">
        <SmoothScroll>
          <Header />
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
