import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "./Breadcrumbs";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Clear tokens from storage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    
    // Redirect to login page
    router.push('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const linkClass = (path: string) =>
    router.pathname === path
      ? "text-green-600 font-semibold"
      : "text-gray-600 hover:text-green-600";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            <img src="acz-logo.jpg" alt="ACZ Logo" className="h-10 w-auto mr-2 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
              AirportFlow<span className="text-green-600">Pro</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className={linkClass('/')}>Dashboard</a>
            <a href="/analytics" className={linkClass('/analytics')}>Analytics</a>
            <a href="/predictions" className={linkClass('/predictions')}>Predictions</a>
            <a href="/reports" className={linkClass('/reports')}>Reports</a>
          </nav>
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
            <div className="relative" ref={menuRef}>
              <button
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-400"
                title="Account menu"
              >
                <span className="text-green-600 font-bold select-none">ACZ</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                  <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile (coming soon)</a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-1">
        <Breadcrumbs />
        {children}
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Airports Company of Zimbabwe (Private) Limited
        </div>
      </footer>
    </div>
  );
};

export default Layout;