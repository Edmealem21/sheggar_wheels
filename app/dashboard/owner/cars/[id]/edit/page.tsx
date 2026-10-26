"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { readStorage, writeStorage } from "@/lib/storage";
import { Car } from "@/types";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function EditCar() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Car | null>(null);

  useEffect(() => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    const found = allCars.find(c => c.id === id);
    if (found) setFormData(found);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    const updated = allCars.map(c => c.id === id ? formData : c);
    
    writeStorage("sw_cars_v1", updated);
    router.push("/dashboard/owner/cars");
  };

  if (!formData) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to my cars
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit car listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg mb-2">Vehicle details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input type="text" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily price (ETB)</label>
              <input type="number" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Neighbourhood</label>
              <input type="text" value={formData.neighbourhood} onChange={e => setFormData({...formData, neighbourhood: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" value={formData.photos[0]} onChange={e => setFormData({...formData, photos: [e.target.value]})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}