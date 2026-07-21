import './globals.css';
import Header from '../components/Header';
import Logo from '../components/Logo';

export const metadata = {
  title: 'HMR Hostel | Safe • Affordable • Comfortable Living',
  description: 'Premium Hostel Accommodation featuring modern rooms, smart allocation, high-speed WiFi, 24x7 security, and modern student portals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-primary-soft text-neutral-800">
        <Header />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-neutral-200/50 py-12 px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-neutral-400">© 2026 HMR Hostel. All rights reserved. Designed for Premium Student Living.</p>
            <div className="flex space-x-6 text-sm text-neutral-400 font-medium">
              <a href="#about" className="hover:text-secondary transition-colors">About</a>
              <a href="#facilities" className="hover:text-secondary transition-colors">Facilities</a>
              <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
