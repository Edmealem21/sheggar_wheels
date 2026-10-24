"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { Booking } from "@/types";
import { Button } from "@/components/ui/Button";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = () => {
    const all = readStorage<Booking[]>("sw_bookings_v1", []);
    setBookings(all.filter(b => b.ownerId === "owner-1"));
  };

  useEffect(() => { loadBookings(); }, []);

  const handleAction = (id: string, newStatus: "confirmed" | "cancelled") => {
    const all = readStorage<Booking[]>("sw_bookings_v1", []);
    const updated = all.map(b => b.id === id ? { ...b, status: newStatus } : b);
    writeStorage("sw_bookings_v1", updated);
    loadBookings();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking requests</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Renter</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">Meron Alemu</td>
                <td className="px-6 py-4 text-gray-500">Toyota Corolla</td>
                <td className="px-6 py-4 text-gray-500">{b.startDate} - {b.endDate}</td>
                <td className="px-6 py-4 font-medium">ETB {b.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    b.status === "requested" ? "bg-orange-100 text-orange-700" :
                    b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    b.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    ● {b.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {b.status === "requested" ? (
                    <div className="flex gap-2">
                      <Button onClick={() => handleAction(b.id, "confirmed")} className="py-1 px-3 text-xs">Approve</Button>
                      <Button variant="outline" onClick={() => handleAction(b.id, "cancelled")} className="py-1 px-3 text-xs">Decline</Button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}