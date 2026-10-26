import { User, Car, Booking, Announcement, Review } from "@/types";
import { readStorage, writeStorage } from "./storage";

export const seedData = () => {
  if (typeof window === "undefined") return;

  // 1. Check Users
  const users = readStorage<User[]>("sw_users_v1", []);
  if (users.length === 0) {
    const demoAdmin: User = { id: "admin-1", name: "Admin Demo", email: "admin@sheggar.et", phone: "+251911000000", roles: ["admin"], status: "Active", createdAt: new Date().toISOString() };
    const demoOwner: User = { id: "owner-1", name: "Dawit Bekele", email: "dawit@sheggar.et", phone: "+251911000001", roles: ["owner", "renter"], status: "Active", createdAt: new Date().toISOString() };
    const demoRenter: User = { id: "renter-1", name: "Meron Alemu", email: "meron@sheggar.et", phone: "+251911000002", roles: ["renter"], status: "Active", createdAt: new Date().toISOString() };
    writeStorage("sw_users_v1", [demoAdmin, demoOwner, demoRenter]);
  }

  // 2. Check Cars
  const cars = readStorage<Car[]>("sw_cars_v1", []);
  if (cars.length === 0) {
    const seedCars: Car[] = [
      { id: "car-1", ownerId: "owner-1", make: "Toyota", model: "Corolla", year: 2021, transmission: "Automatic", seats: 5, city: "Addis Ababa", neighbourhood: "Bole", pricePerDay: 3200, photos: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
      { id: "car-2", ownerId: "owner-2", make: "Hyundai", model: "Tucson", year: 2022, transmission: "Automatic", seats: 5, city: "Addis Ababa", neighbourhood: "Kazanchis", pricePerDay: 5400, photos: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
      { id: "car-3", ownerId: "owner-1", make: "Toyota", model: "RAV4", year: 2020, transmission: "Automatic", seats: 5, city: "Addis Ababa", neighbourhood: "Piassa", pricePerDay: 6100, photos: ["https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
      { id: "car-4", ownerId: "owner-3", make: "Suzuki", model: "Swift", year: 2019, transmission: "Manual", seats: 4, city: "Addis Ababa", neighbourhood: "CMC", pricePerDay: 2100, photos: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"], status: "approved", createdAt: new Date().toISOString() },
    ];
    writeStorage("sw_cars_v1", seedCars);
  }

  // 3. Check Bookings
  const bookings = readStorage<Booking[]>("sw_bookings_v1", []);
  if (bookings.length === 0) {
    const seedBookings: Booking[] = [
      { id: "SW-24819", carId: "car-3", renterId: "renter-1", ownerId: "owner-1", startDate: "2026-11-08", endDate: "2026-11-11", total: 17496, status: "confirmed", createdAt: new Date().toISOString() },
      { id: "SW-24702", carId: "car-1", renterId: "renter-1", ownerId: "owner-1", startDate: "2026-10-02", endDate: "2026-10-05", total: 10368, status: "completed", createdAt: new Date().toISOString() },
    ];
    writeStorage("sw_bookings_v1", seedBookings);
  }

  // 4. Check Reviews (THIS IS THE FIX)
  const reviews = readStorage<Review[]>("sw_reviews_v1", []);
  if (reviews.length === 0) {
    const seedReviews: Review[] = [
      { id: "rev-1", bookingId: "SW-24702", carId: "car-1", renterId: "renter-1", renterName: "Meron A.", ownerId: "owner-1", rating: 5, comment: "Spotless car and smooth pickup in Bole.", ownerReply: null, createdAt: new Date().toISOString() },
      { id: "rev-2", bookingId: "SW-24819", carId: "car-3", renterId: "renter-2", renterName: "Samuel T.", ownerId: "owner-1", rating: 4, comment: "Great ride, slightly late handover.", ownerReply: null, createdAt: new Date().toISOString() }
    ];
    writeStorage("sw_reviews_v1", seedReviews);
  }

  // 5. Check Announcements
  const announcements = readStorage<Announcement[]>("sw_announcements_v1", []);
  if (announcements.length === 0) {
    const seedAnnouncements: Announcement[] = [
      { id: "a1", title: "Weekend maintenance window", message: "Sat 28 Oct, 02:00-04:00. Demo only.", active: true, createdAt: new Date().toISOString() }
    ];
    writeStorage("sw_announcements_v1", seedAnnouncements);
  }
};