"use client";
import { useEffect, useState, KeyboardEvent } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Car } from "@/types";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OwnerCars() {
  const [cars, setCars] = useState<Car[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadCars = () => {
    const user = getSession();
    if (user) {
      const allCars = readStorage<Car[]>("sw_cars_v1", []);
      setCars(allCars.filter(c => c.ownerId === user.id));
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  // Ensure current page doesn't become invalid if a car is removed
  useEffect(() => {
    const totalPages = Math.ceil(cars.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [cars, currentPage]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    
    // Toggle logic
    const newStatus = currentStatus === "inactive" ? "approved" : "inactive";
    
    const updated = allCars.map(c => 
      c.id === id ? { ...c, status: newStatus as Car["status"] } : c
    );
    
    writeStorage("sw_cars_v1", updated);
    loadCars(); 
  };

  // --- KEYBOARD NAVIGATION LOGIC ---
  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    const row = e.currentTarget;
    const actions = Array.from(row.querySelectorAll("a, button")) as HTMLElement[];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = row.nextElementSibling as HTMLElement;
      if (nextRow) nextRow.focus();
    } 
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevRow = row.previousElementSibling as HTMLElement;
      if (prevRow) prevRow.focus();
    } 
    else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (document.activeElement === row && actions.length > 0) {
        actions[0].focus();
      } else {
        const currentIndex = actions.indexOf(document.activeElement as HTMLElement);
        if (currentIndex !== -1 && currentIndex < actions.length - 1) {
          actions[currentIndex + 1].focus();
        }
      }
    } 
    else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIndex = actions.indexOf(document.activeElement as HTMLElement);
      if (currentIndex > 0) {
        actions[currentIndex - 1].focus();
      } else if (currentIndex === 0) {
        row.focus();
      }
    } 
    else if (e.key === "Enter") {
      if (document.activeElement === row && actions.length > 0) {
        e.preventDefault();
        actions[0].click();
      }
    }
  };
  // ---------------------------------

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = cars.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My cars</h1>
        <Link 
          href="/dashboard/owner/cars/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          + Add a car
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
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
              {currentCars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    You haven&apos;t added any cars yet.
                  </td>
                </tr>
              ) : (
                currentCars.map(car => (
                  <tr 
                    key={car.id} 
                    tabIndex={0}
                    onKeyDown={handleRowKeyDown}
                    className="hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{car.make} {car.model} {car.year}</p>
                        <p className="text-xs text-gray-500">{car.neighbourhood}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ETB {car.pricePerDay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize border ${
                        car.status === "approved" ? "bg-green-50 text-green-700 border-green-100" : 
                        car.status === "pending" ? "bg-orange-50 text-orange-700 border-orange-100" : 
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        ● {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {car.status === "approved" ? "Open for booking" : "Not available"}
                    </td>
                    <td className="px-6 py-4 text-sm flex items-center gap-4">
                      <Link 
                        href={`/cars/${car.id}`} 
                        className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      >
                        View
                      </Link>
                      
                      <Link 
                        href={`/dashboard/owner/cars/${car.id}/edit`} 
                        className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      >
                        Edit
                      </Link>
                      
                      <button 
                        onClick={() => handleToggleStatus(car.id, car.status)} 
                        className={`font-medium hover:underline focus:outline-none focus:ring-2 rounded px-1 ${
                          car.status === "inactive" 
                            ? "text-green-600 focus:ring-green-500" 
                            : "text-red-600 focus:ring-red-500"
                        }`}
                      >
                        {car.status === "inactive" ? "Activate" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {cars.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastItem > cars.length ? cars.length : indexOfLastItem}
              </span>{" "}
              of <span className="font-medium">{cars.length}</span> cars
            </p>
            
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      currentPage === page 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}