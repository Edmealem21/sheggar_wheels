"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { seedData } from "@/lib/seed";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Search, MapPin, Calendar, Users, Settings2, Star, Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import { readStorage } from "@/lib/storage";
import { Car } from "@/types";

export default function LandingPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [pickupDate, setPickupDate] = useState("2026-08-11");
  const [returnDate, setReturnDate] = useState("2026-11-11");

  useEffect(() => {
    seedData();
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    // Changed from .slice(0, 4) to .slice(0, 3)
    setCars(allCars.filter(c => c.status === "approved").slice(0, 3));
  }, []);

  const handleSearch = () => {
    router.push(`/cars?query=${encodeURIComponent(searchQuery)}&start=${pickupDate}&end=${returnDate}`);
  };

  const mockRatings = ["4.8 (24)", "4.9 (17)", "4.7 (31)", "4.5 (12)"];

  return (
    <div className="min-h-screen bg-white font-sans">
      <PublicNavbar />
      
      {/* Hero Section - Minimized Height */}
      <section className="relative bg-[#0f172a] py-8 md:py-12 px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
            alt="Mountains" 
            className="w-full h-full object-cover opacity-30 object-bottom"
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-full text-xs font-medium mb-3 md:mb-4 border border-slate-700">
            <MapPin className="w-3.5 h-3.5" /> Peer-to-peer rentals in Addis Ababa
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white max-w-2xl leading-tight">
            Your next journey starts here.
          </h1>
          <p className="text-slate-300 mb-6 max-w-xl text-sm md:text-base">
            Discover and rent cars from local owners in Addis Ababa. Find the right vehicle for your next trip.
          </p>
          
          <div className="flex gap-4 mb-6 md:mb-8">
            <Link href="/cars" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Explore cars
            </Link>
            <Link href="/#become-a-host" className="border border-slate-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              Become a host
            </Link>
          </div>

          {/* Functional Search Bar with Text Input */}
          <div className="bg-white rounded-xl p-2 flex flex-col lg:flex-row shadow-2xl max-w-4xl gap-2 lg:gap-0">
            
            {/* Car Name Search Input */}
            <div className="flex-1 flex flex-col px-4 py-2 border-b lg:border-b-0 lg:border-r border-gray-200">
              <label className="text-xs font-semibold text-gray-500 mb-1">Search by car name</label>
              <div className="flex items-center gap-2">
                <Search className="text-gray-400 w-4 h-4" />


                  <input 
                    type="text" 
                    placeholder="e.g. Toyota Corolla"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    // ADD THIS ONKEYDOWN EVENT:
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="w-full outline-none text-gray-900 text-sm bg-transparent font-medium placeholder:font-normal focus:ring-2 focus:ring-blue-500 rounded px-1" 
                  />
              </div>
            </div>

            <div className="flex-1 flex flex-col px-4 py-2 border-b lg:border-b-0 lg:border-r border-gray-200">
              <label className="text-xs font-semibold text-gray-500 mb-1">Pickup date</label>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400 w-4 h-4" />
                <input 
                  type="date" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full outline-none text-gray-900 text-sm bg-transparent font-medium" 
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col px-4 py-2 border-b lg:border-b-0 lg:border-r border-gray-200">
              <label className="text-xs font-semibold text-gray-500 mb-1">Return date</label>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400 w-4 h-4" />
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full outline-none text-gray-900 text-sm bg-transparent font-medium" 
                />
              </div>
            </div>
            <div className="p-2">
              <button 
                onClick={handleSearch}
                className="w-full lg:w-auto h-full bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Search cars
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Briefcase, title: "Flexible rentals", desc: "Rent for a day or a week. Choose dates that fit your plans and request in minutes." },
            { icon: Users, title: "Local car owners", desc: "Every car is listed by a neighbour in Addis Ababa and reviewed by our team first." },
            { icon: FileText, title: "Transparent pricing", desc: "See the daily rate, platform fee and total before you send a request." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-8 px-6 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Find the right car for your journey</h2>
            <p className="text-gray-500 text-sm mt-1">Explore vehicles available from local owners.</p>
          </div>
          <Link href="/cars" className="text-blue-600 font-medium text-sm hover:underline">View all cars &rarr;</Link>
        </div>

        {/* Changed to lg:grid-cols-3 to show only 3 cars on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            // Increased shadow: shadow-xl hover:shadow-2xl
            <div key={car.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-gray-900">{car.make} {car.model}</h3>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" /> {mockRatings[index]}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{car.year}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {car.neighbourhood}, {car.city}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {car.seats} seats</span>
                  <span className="flex items-center gap-1"><Settings2 className="w-4 h-4" /> {car.transmission}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 text-xl">ETB {car.pricePerDay.toLocaleString()}</span>
                    <span className="text-xs text-gray-500"> / day</span>
                  </div>
                  <Link href={`/cars/${car.id}`} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
          <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">DEMO DATA</span>
          Listings, ratings and prices are fictional sample content.
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 px-6 md:px-8 bg-gray-50 border-t border-b border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">How Sheggar Wheels works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: Search, title: "Find your car", desc: "Filter by neighbourhood, price, seats and transmission to shortlist options." },
              { step: 2, icon: Calendar, title: "Request your booking", desc: "Pick your dates and send a request. The owner confirms, you review and pay in demo checkout." },
              { step: 3, icon: Users, title: "Enjoy your journey", desc: "Pick up the car, drive, and leave a review once the trip is complete." }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="become-a-host" className="py-16 px-6 md:px-8 max-w-6xl mx-auto">
        <div className="bg-[#0f172a] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-slate-700/30 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-xl">
            <div className="w-10 h-1 bg-orange-300 rounded mb-6"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Turn your car into an opportunity.</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Publish your vehicle, manage availability, respond to booking requests and track your demo earnings from one owner dashboard.
            </p>
            <Link href="/signup" className="bg-orange-200 text-orange-950 px-6 py-3 rounded-lg font-bold hover:bg-orange-300 transition-colors inline-block">
              Become a host
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}