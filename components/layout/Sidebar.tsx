"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LayoutDashboard, Users, CalendarCheck, AlertCircle, BarChart3, Megaphone, LogOut, PlusCircle, Wallet, Star, Bell, History, User, X } from "lucide-react";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ role, isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const menus = {
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Listings", href: "/dashboard/admin/listings", icon: Car },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck },
      { name: "Disputes", href: "/dashboard/admin/disputes", icon: AlertCircle },
      { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
      { name: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
    ],
    owner: [
      { name: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
      { name: "My cars", href: "/dashboard/owner/cars", icon: Car },
      { name: "Add a car", href: "/dashboard/owner/cars/new", icon: PlusCircle },
      { name: "Booking requests", href: "/dashboard/owner/bookings", icon: CalendarCheck },
      { name: "Earnings", href: "/dashboard/owner/earnings", icon: Wallet },
      { name: "Reviews", href: "/dashboard/owner/reviews", icon: Star },
      { name: "Disputes", href: "/dashboard/owner/disputes", icon: AlertCircle },
    ],
    renter: [
      { name: "Overview", href: "/dashboard/renter", icon: LayoutDashboard },
      { name: "My bookings", href: "/dashboard/renter/bookings", icon: CalendarCheck },
      { name: "Trip history", href: "/dashboard/renter/history", icon: History },
      { name: "Notifications", href: "/dashboard/renter/notifications", icon: Bell },
      { name: "Profile", href: "/dashboard/renter/profile", icon: User },
    ],
  };

  const currentMenu = menus[role as keyof typeof menus] || [];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-tight">Sheggar Wheels</h1>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{role}</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {currentMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 w-full">
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};