"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { readStorage, writeStorage } from "@/lib/storage";
import { Car } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AddCar() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: "", model: "", year: 2024, transmission: "Automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Bole", pricePerDay: 3000, description: ""
  });

  const handleSubmit = (e: React.FormEvent, status: "draft" | "pending") => {
    e.preventDefault();
    const cars = readStorage<Car[]>("sw_cars_v1", []);
    
    const newCar: Car = {
      id: crypto.randomUUID(),
      ownerId: "owner-1",
      make: formData.make,
      model: formData.model,
      year: Number(formData.year),
      transmission: formData.transmission as "Automatic" | "Manual",
      seats: Number(formData.seats),
      city: formData.city,
      neighbourhood: formData.neighbourhood,
      pricePerDay: Number(formData.pricePerDay),
      photos: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800"],
      status: status,
      createdAt: new Date().toISOString()
    };

    writeStorage("sw_cars_v1", [...cars, newCar]);
    router.push("/dashboard/owner/cars");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a car</h1>
      <p className="text-gray-500 mb-6">New listings are reviewed before they appear publicly.</p>

      <form className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg mb-2">Vehicle details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input type="text" placeholder="Toyota" onChange={e => setFormData({...formData, make: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input type="text" placeholder="Corolla" onChange={e => setFormData({...formData, model: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" onChange={e => setFormData({...formData, year: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select onChange={e => setFormData({...formData, transmission: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily price (ETB)</label>
              <input type="number" onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={(e) => handleSubmit(e, "draft")}>Save draft</Button>
          <Button onClick={(e) => handleSubmit(e, "pending")}>Submit for approval</Button>
        </div>
      </form>
    </div>
  );
}