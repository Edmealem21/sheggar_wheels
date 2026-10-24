"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { readStorage } from "@/lib/storage";
import { seedData } from "@/lib/seed";
import { Car } from "@/types";
import { SlidersHorizontal, Search } from "lucide-react";
import Link from "next/link";

// We wrap the component in Suspense because useSearchParams requires it in Next.js App Router
export default function CarsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CarsCatalogue />
    </Suspense>
  );
}

function CarsCatalogue() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    seedData();
    const allCars = readStorage<Car[]>("sw_cars_v1", []).filter(c => c.status === "approved");
    setCars(allCars);
    
    // Filter based on search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      const filtered = allCars.filter(c => 
        c.make.toLowerCase().includes(lowerQuery) || 
        c.model.toLowerCase().includes(lowerQuery)
      );
      setFilteredCars(filtered);
    } else {
      setFilteredCars(allCars);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8 flex-1 w-full">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make or model</label>
                <input type="text" defaultValue={query || ""} placeholder="e.g. Toyota" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Neighbourhood</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option>All of Addis Ababa</option>
                  <option>Bole</option>
                  <option>Piassa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily price (ETB)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <input type="number" placeholder="Max" className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option>Any</option>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
              <button className="w-full text-sm text-blue-600 font-medium mt-4">Clear filters</button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 text-sm">
              {filteredCars.length} cars found {query && `for "${query}"`}
            </p>
            <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Most popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          
          {filteredCars.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center border border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No cars match your filters</h3>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <Link href="/cars" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map(car => (
                <div key={car.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900">{car.make} {car.model} {car.year}</h3>
                    <p className="text-gray-500 text-sm mt-1">{car.neighbourhood}, {car.city}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{car.seats} seats</span> • <span>{car.transmission}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">ETB {car.pricePerDay.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm"> /day</span>
                      </div>
                      <Link href={`/cars/${car.id}`} className="text-blue-600 text-sm font-medium hover:underline">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}