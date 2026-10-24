"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { Car } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AdminListings() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    setCars(allCars.filter(c => c.status === "pending"));
  }, []);

  const handleAction = (id: string, status: "approved" | "rejected") => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    const updated = allCars.map(c => c.id === id ? { ...c, status } : c);
    writeStorage("sw_cars_v1", updated);
    setCars(updated.filter(c => c.status === "pending"));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Listings moderation</h1>
        <p className="text-gray-500 mt-1">{cars.length} awaiting review</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{car.make} {car.model} {car.year}</h3>
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  ● Pending Approval
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Owner: Dawit Bekele • {car.neighbourhood} • ETB {car.pricePerDay}/day
              </p>
              <div className="flex gap-3">
                <Button onClick={() => handleAction(car.id, "approved")}>Approve</Button>
                <Button variant="outline" onClick={() => handleAction(car.id, "rejected")}>Reject</Button>
              </div>
            </div>
          </div>
        ))}
        {cars.length === 0 && <p className="text-gray-500">No pending listings.</p>}
      </div>
    </div>
  );
}