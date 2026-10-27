"use client";
import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Booking, Car } from "@/types";
import Link from "next/link";
import { MapPin, History } from "lucide-react";

type EnrichedBooking = Booking & { car?: Car };

export default function TripHistory() {
  const [history, setHistory] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getSession();
    
    if (user) {
      const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
      const allCars = readStorage<Car[]>("sw_cars_v1", []);
      
      // Filter for this user AND only past/completed trips
      const pastTrips = allBookings
        .filter(b => b.renterId === user.id && ["completed", "reviewed", "cancelled"].includes(b.status))
        .map(b => ({ ...b, car: allCars.find(c => c.id === b.carId) }));

      setHistory(pastTrips.reverse());
    }
    
    setLoading(false);
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading history...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trip history</h1>
        <p className="text-gray-500 mt-1">Review your past journeys and completed trips.</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No trip history yet</h3>
            <p className="text-gray-500 mb-6 text-sm">You haven&apos;t completed any trips so far.</p>
            <Link href="/cars" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Find a car to rent
            </Link>
          </div>
        ) : (
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
              {history.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-12 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                      {b.car && <img src={b.car.photos[0]} alt={b.car.model} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {b.car ? `${b.car.make} ${b.car.model}` : "Unknown Car"}
                      </p>
                      {b.car && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {b.car.neighbourhood}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.startDate} - {b.endDate}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">ETB {b.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${
                      b.status === "completed" ? "bg-green-50 text-green-600 border-green-100" :
                      b.status === "reviewed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                      ● {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/dashboard/renter/bookings/${b.id}`} className="text-blue-600 font-medium hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}