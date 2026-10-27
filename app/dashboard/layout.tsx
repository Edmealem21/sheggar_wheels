"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";
import { User } from "@/types";
import { Bell, Menu } from "lucide-react";
import { seedData } from "@/lib/seed";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

  useEffect(() => {
    seedData();
    const session = getSession();
    
    if (!session) {
      window.location.href = "/signin";
    } else {
      setUser(session);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  const role = user.roles.includes("admin") ? "admin" : user.roles.includes("owner") ? "owner" : "renter";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (with state props) */}
      <Sidebar role={role} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">DEMO DATA</span> */}
          </div>
          
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-900 leading-tight">{user.name}</p>
                <p className="text-gray-500 text-xs capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Added overflow-x-hidden to prevent horizontal scroll from tables */}
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}