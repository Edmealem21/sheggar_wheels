import { User, Car, Booking, Announcement } from "@/types";
import { readStorage, writeStorage } from "./storage";

export const seedData = () => {
  if (typeof window === "undefined") return;

  const users = readStorage<User[]>("sw_users_v1", []);
  
  // Check if the specific demo users exist. If not, reset the data.
  const hasAdmin = users.some(u => u.id === "admin-1");
  const hasOwner = users.some(u => u.id === "owner-1");
  const hasRenter = users.some(u => u.id === "renter-1");
  
  if (hasAdmin && hasOwner && hasRenter) return; 

  const demoAdmin: User = { id: "admin-1", name: "Admin Demo", email: "admin@sheggar.et", phone: "+251911000000", roles: ["admin"], status: "Active", createdAt: new Date().toISOString() };
  const demoOwner: User = { id: "owner-1", name: "Dawit Bekele", email: "dawit@sheggar.et", phone: "+251911000001", roles: ["owner", "renter"], status: "Active", createdAt: new Date().toISOString() };
  const demoRenter: User = { id: "renter-1", name: "Meron Alemu", email: "meron@sheggar.et", phone: "+251911000002", roles: ["renter"], status: "Active", createdAt: new Date().toISOString() };

  const cars: Car[] = [
    { id: "car-1", ownerId: "owner-1", make: "Toyota", model: "Corolla", year: 2021, transmission: "Automatic", seats: 5, city: "Addis Ababa", neighbourhood: "Bole", pricePerDay: 3200, photos: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
    { id: "car-2", ownerId: "owner-2", make: "Hyundai", model: "Tucson", year: 2022, transmission: "Automatic", seats: 5, city: "Addis Ababa", neighbourhood: "Kazanchis", pricePerDay: 5400, photos: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
    { id: "car-3", ownerId: "owner-1", make: "Toyota", model: "RAV4", year: 2020, transmission: "Automatic", seats: 5, city: "Addis Ababa", neighbourhood: "Piassa", pricePerDay: 6100, photos: ["https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
    { id: "car-4", ownerId: "owner-3", make: "Suzuki", model: "Swift", year: 2019, transmission: "Manual", seats: 4, city: "Addis Ababa", neighbourhood: "CMC", pricePerDay: 2100, photos: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
  ];

  const bookings: Booking[] = [
    { id: "SW-24819", carId: "car-3", renterId: "renter-1", ownerId: "owner-2", startDate: "8 Nov 2026", endDate: "11 Nov 2026", total: 17496, status: "confirmed", createdAt: new Date().toISOString() },
    { id: "SW-24702", carId: "car-1", renterId: "renter-1", ownerId: "owner-1", startDate: "2 Oct 2026", endDate: "5 Oct 2026", total: 10368, status: "completed", createdAt: new Date().toISOString() },
    { id: "SW-24911", carId: "car-1", renterId: "renter-1", ownerId: "owner-1", startDate: "14 Nov 2026", endDate: "17 Nov 2026", total: 10368, status: "requested", createdAt: new Date().toISOString() }
  ];

  const announcements: Announcement[] = [
    { id: "a1", title: "Weekend maintenance window", message: "Sat 28 Oct, 02:00-04:00. Demo only.", active: true, createdAt: new Date().toISOString() }
  ];

  writeStorage("sw_users_v1", [demoAdmin, demoOwner, demoRenter]);
  writeStorage("sw_cars_v1", cars);
  writeStorage("sw_bookings_v1", bookings);
  writeStorage("sw_announcements_v1", announcements);
};