"use client";
import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { Booking } from "@/types";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setBookings(readStorage<Booking[]>("sw_bookings_v1", []));
  }, []);

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter.toLowerCase());

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bookings</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex gap-4 overflow-x-auto">
          {["All", "Requested", "Confirmed", "Completed", "Disputed"].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap ${filter === f ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Renter</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">Meron Alemu</td>
                <td className="px-6 py-4 text-sm text-gray-500">Dawit Bekele</td>
                <td className="px-6 py-4 text-sm text-gray-500">{b.startDate} - {b.endDate}</td>
                <td className="px-6 py-4 text-sm font-medium">ETB {b.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    b.status === "requested" ? "bg-orange-100 text-orange-700" :
                    b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    b.status === "completed" ? "bg-green-100 text-green-700" : 
                    b.status === "disputed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    ● {b.status.replace("_", " ")}
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