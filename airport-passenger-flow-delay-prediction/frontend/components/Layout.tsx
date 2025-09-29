import React from "react";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow p-4 flex items-center">
                <img src="/acz-logo.jpg" alt="ACZ Logo" className="h-12 w-auto mr-4" />
                <h1 className="text-2xl font-bold text-green-700">
                    Airports Company of Zimbabwe
                </h1>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-100 text-center p-2 text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Airports Company of Zimbabwe (Private) Limited
            </footer>
        </div>
    );
};

export default Layout;