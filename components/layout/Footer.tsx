import Link from "next/link";
import { Car } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-300 py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <Car className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">Sheggar Wheels</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            A peer-to-peer car rental marketplace connecting renters with local car owners across Addis Ababa.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/cars" className="hover:text-white transition-colors">Browse cars</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
            <li><Link href="/#become-a-host" className="hover:text-white transition-colors">Become a host</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-semibold text-white mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/signin" className="hover:text-white transition-colors">Sign in</Link></li>
            <li><Link href="/signup" className="hover:text-white transition-colors">Create account</Link></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Design system</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>hello@sheggarwheels.example</li>
            <li>+251 11 000 0000</li>
            <li>Bole, Addis Ababa</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 Sheggar Wheels. Capstone demo project — no real payments, tracking or bookings.
      </div>
    </footer>
  );
};