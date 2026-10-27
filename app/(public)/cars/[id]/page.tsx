"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { readStorage } from "@/lib/storage";
import { Car } from "@/types";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Button } from "@/components/ui/Button";
import { MapPin, Users, Settings2, ShieldCheck } from "lucide-react";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    const found = allCars.find(c => c.id === id);
    if (found) setCar(found);
  }, [id]);

  if (!car) return <div className="p-10 text-center">Car not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <img src={car.photos[0]} alt={car.model} className="w-full h-96 object-cover" />
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.make} {car.model} {car.year}</h1>
              <p className="text-gray-500 flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4" /> {car.neighbourhood}, {car.city}
              </p>
              
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div className="text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">{car.seats} Seats</p>
                </div>
                <div className="text-center">
                  <Settings2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">{car.transmission}</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Verified Owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">ETB {car.pricePerDay.toLocaleString()}</span>
                <span className="text-gray-500"> / day</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Pick-up Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Drop-off Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <Button className="w-full py-3 text-lg" onClick={() => router.push(`/checkout?carId=${car.id}`)}>
                Request Booking
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4">You won&apos;t be charged yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}