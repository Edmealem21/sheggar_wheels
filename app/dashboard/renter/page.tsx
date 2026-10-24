"use client";
import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { Booking } from "@/types";
import { CalendarCheck, CheckCircle2, XCircle, Wallet } from "lucide-react";
import Link from "next/link";

export default function RenterOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    setBookings(allBookings.filter(b => b.renterId === "renter-1"));
  }, []);

  const upcoming = bookings.filter(b => b.status === "confirmed").length;
  const completed = bookings.filter(b => b.status === "completed").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;
  const total = bookings.reduce((sum, b) => sum + b.total, 0);

  const stats = [
    { label: "Upcoming trips", value: upcoming, icon: CalendarCheck },
    { label: "Completed trips", value: completed, icon: CheckCircle2 },
    { label: "Cancelled trips", value: cancelled, icon: XCircle },
    { label: "Total spending", value: `ETB ${total.toLocaleString()}`, icon: Wallet },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Meron</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your trips.</p>
        </div>
        <Link href="/cars" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          Explore cars
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg">Recent booking activity</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Vehicle</th>
              <th className="px-6 py-3">Reference</th>
              <th className="px-6 py-3">Dates</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-gray-900">Toyota Corolla</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{b.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{b.startDate} - {b.endDate}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">ETB {b.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 capitalize">
                    {b.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}