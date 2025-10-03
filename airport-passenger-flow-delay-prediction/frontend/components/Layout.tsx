import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="acz-logo.jpg" alt="ACZ Logo" className="h-10 w-auto mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            AirportFlow<span className="text-green-600">Pro</span>
          </h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-green-600 font-medium">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-green-600">Analytics</a>
          <a href="#" className="text-gray-600 hover:text-green-600">Predictions</a>
          <a href="#" className="text-gray-600 hover:text-green-600">Reports</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300">
            User Dashboard
          </button>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 font-bold">ACZ</span>
          </div>
        </div>
      </div>
    </header>
    <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Airports Company of Zimbabwe (Private) Limited
      </div>
    </footer>
  </div>
);

export default Layout;