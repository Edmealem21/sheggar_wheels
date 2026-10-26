"use client";
import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Booking, Car, User } from "@/types";
import { CalendarCheck, CheckCircle2, XCircle, Wallet, MapPin } from "lucide-react";
import Link from "next/link";

type EnrichedBooking = Booking & { car?: Car };

export default function RenterOverview() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [nextBooking, setNextBooking] = useState<EnrichedBooking | null>(null);

  useEffect(() => {
    const session = getSession();
    setUser(session);

    if (session) {
      const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
      const allCars = readStorage<Car[]>("sw_cars_v1", []);
      
      // Get user bookings and enrich with car data
      const myBookings = allBookings
        .filter(b => b.renterId === session.id)
        .map(b => ({ ...b, car: allCars.find(c => c.id === b.carId) }));

      setBookings(myBookings);

      // Find the first confirmed booking for the "Next booking" card
      const upcoming = myBookings.find(b => b.status === "confirmed");
      if (upcoming) setNextBooking(upcoming);
    }
  }, []);

  if (!user) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  const upcomingCount = bookings.filter(b => b.status === "confirmed").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const totalSpend = bookings.filter(b => ["confirmed", "completed"].includes(b.status)).reduce((sum, b) => sum + b.total, 0);

  const stats = [
    { label: "Upcoming trips", value: upcomingCount, icon: CalendarCheck },
    { label: "Completed trips", value: completedCount, icon: CheckCircle2 },
    { label: "Cancelled trips", value: cancelledCount, icon: XCircle },
    { label: "Total spending", value: `ETB ${totalSpend.toLocaleString()}`, icon: Wallet, sub: "Demo amounts" },
  ];

  // Helper to get status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
      case "completed": return "bg-green-50 text-green-600 border-green-100";
      case "reviewed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-orange-50 text-orange-600 border-orange-100";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-gray-500 mt-1 text-sm">Here's what's happening with your trips.</p>
        </div>
        <Link href="/cars" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Explore cars
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            {stat.sub && <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Bookings Table (Left 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-900">Recent booking activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Dates</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.slice(0, 4).map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                        {b.car && <img src={b.car.photos[0]} alt={b.car.model} className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-gray-900">
                        {b.car ? `${b.car.make} ${b.car.model}` : "Unknown Car"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{b.id}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{b.startDate} - {b.endDate}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      <div className="text-xs text-gray-500">ETB</div>
                      {b.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(b.status)}`}>
                        ● <span className="capitalize">{b.status.replace("_", " ")}</span>
                      </span>
                    </td>
                    
                    <td className="px-5 py-4 flex items-center gap-3">
                      <Link href={`/dashboard/renter/bookings/${b.id}`} className="text-blue-600 font-medium hover:underline">
                        View
                      </Link>
                      
                      {b.status === "requested" && (
                        <button onClick={() => { /* Optional: add cancel logic here too */ }} className="text-red-500 font-medium hover:underline">Cancel</button>
                      )}
                      
                      {b.status === "confirmed" && (
                        <Link href={`/dashboard/renter/bookings/${b.id}/track`} className="text-blue-600 font-medium hover:underline">Track</Link>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No recent bookings.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Booking Card (Right 1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">Next booking</h2>
            </div>
            
            {nextBooking && nextBooking.car ? (
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img src={nextBooking.car.photos[0]} alt={nextBooking.car.model} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{nextBooking.car.make} {nextBooking.car.model}</h3>
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${getStatusBadge(nextBooking.status)}`}>
                    ● {nextBooking.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-1">{nextBooking.startDate} - {nextBooking.endDate}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-6">
                  <MapPin className="w-3 h-3" /> {nextBooking.car.neighbourhood}, {nextBooking.car.city}
                </p>
                
                <div className="mt-auto">
                  <Link href={`/dashboard/renter/bookings/${nextBooking.id}`} className="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    View details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <CalendarCheck className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No upcoming trips.</p>
                <Link href="/cars" className="text-blue-600 text-sm font-medium hover:underline mt-2">Book a car</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}