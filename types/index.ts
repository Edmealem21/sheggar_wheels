export type Role = "renter" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  status: "Active" | "Suspended";
  createdAt: string;
}

export interface Car {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  transmission: "Automatic" | "Manual";
  seats: number;
  city: string;
  neighbourhood: string;
  pricePerDay: number;
  photos: string[];
  status: "draft" | "pending" | "approved" | "rejected" | "inactive";
  createdAt: string;
}

export interface Booking {
  id: string;
  carId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  total: number;
  status: "requested" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed" | "reviewed";
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  active: boolean;
  createdAt: string;
}