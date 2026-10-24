"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { Car } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OwnerCars() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    setCars(allCars.filter(c => c.ownerId === "owner-1"));
  }, []);

  const deactivateCar = (id: string) => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    const updated = allCars.map(c => c.id === id ? { ...c, status: "inactive" as const } : c);
    writeStorage("sw_cars_v1", updated);
    setCars(updated.filter(c => c.ownerId === "owner-1"));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My cars</h1>
        <Link href="/dashboard/owner/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          + Add a car
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Daily Price</th>
              <th className="px-6 py-4">Listing</th>
              <th className="px-6 py-4">Availability</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-12 h-10 rounded bg-gray-200 overflow-hidden">
                    <img src={car.photos[0]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{car.make} {car.model} {car.year}</p>
                    <p className="text-xs text-gray-500">{car.neighbourhood}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">ETB {car.pricePerDay.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    car.status === "approved" ? "bg-green-100 text-green-700" : 
                    car.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    ● {car.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Open for booking</td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <Link href={`/cars/${car.id}`} className="text-blue-600 font-medium hover:underline">View</Link>
                  <button className="text-blue-600 font-medium hover:underline">Edit</button>
                  <button onClick={() => deactivateCar(car.id)} className="text-red-600 font-medium hover:underline">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}