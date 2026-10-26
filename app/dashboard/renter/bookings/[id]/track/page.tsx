"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { readStorage } from "@/lib/storage";
import { Booking, Car } from "@/types";
import { ArrowLeft, Navigation, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading map...</div>
});

// Simple mock coordinates based on neighbourhoods
const neighbourhoodCoords: Record<string, [number, number]> = {
  "Bole": [8.9936, 38.7876],
  "Piassa": [9.0354, 38.7522],
  "Kazanchis": [9.0183, 38.7625],
  "CMC": [9.0192, 38.8353],
  "Default": [9.0300, 38.7400], // Addis Ababa Center
};

export default function TrackTrip() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const bookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const foundBooking = bookings.find(b => b.id === id);
    
    if (foundBooking) {
      setBooking(foundBooking);
      const cars = readStorage<Car[]>("sw_cars_v1", []);
      const foundCar = cars.find(c => c.id === foundBooking.carId);
      if (foundCar) setCar(foundCar);
    }
  }, [id]);

  if (!booking || !car) return <div className="p-10 text-center text-gray-500">Loading tracking data...</div>;

  const coords = neighbourhoodCoords[car.neighbourhood] || neighbourhoodCoords["Default"];

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to booking details
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Trip Tracking</h1>
          <p className="text-gray-500">Booking Reference: {booking.id} • {car.make} {car.model}</p>
        </div>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200">
          SIMULATION ONLY
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Leaflet Map */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 h-[400px] relative z-0">
            <Map center={coords} carName={`${car.make} ${car.model}`} neighbourhood={car.neighbourhood} />
          </div>
          
          {/* Fallback Address (Required by Brief) */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm flex items-center gap-2 shadow-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Pickup address fallback:</span>
            <span className="font-semibold text-gray-900">{car.neighbourhood}, {car.city}</span>
          </div>
        </div>

        {/* Right: Status Timeline */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
            <h2 className="font-bold text-lg mb-6">Trip Status</h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200">
              
              {/* Step 1 */}
              <div className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0 z-10">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Booking Confirmed</p>
                  <p className="text-xs text-gray-500">Owner approved the request.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 z-10 animate-pulse">
                  <Navigation className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600">In Progress</p>
                  <p className="text-xs text-gray-500">Trip is currently underway (Simulated).</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 z-10">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Completed</p>
                  <p className="text-xs text-gray-400">Awaiting return.</p>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3">Need help with this trip?</p>
              <Button variant="outline" className="w-full">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}