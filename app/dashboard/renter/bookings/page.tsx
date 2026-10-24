"use client";
import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { Booking } from "@/types";
import Link from "next/link";

export default function RenterBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    setBookings(allBookings.filter(b => b.renterId === "renter-1"));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My bookings</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
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
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    b.status === "completed" ? "bg-green-100 text-green-700" :
                    b.status === "cancelled" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"
                  }`}>
                    ● {b.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link href={`/dashboard/renter/bookings/${b.id}`} className="text-blue-600 font-medium hover:underline mr-3">View</Link>
                  {b.status === "confirmed" && <button className="text-red-600 font-medium hover:underline">Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}