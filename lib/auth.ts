import { readStorage } from "./storage";
import { User } from "@/types";
import { seedData } from "./seed";

export const getSession = (): User | null => {
  if (typeof window === "undefined") return null;
  
  seedData(); 
  
  // Try sessionStorage first, fallback to localStorage
  let sessionId = sessionStorage.getItem("sw_session_v1");
  if (!sessionId) {
    sessionId = localStorage.getItem("sw_session_v1_fallback");
  }
  
  if (!sessionId) return null;
  
  const users = readStorage<User[]>("sw_users_v1", []);
  return users.find((u) => u.id === sessionId) || null;
};

export const signInAsDemo = (userId: string) => {
  seedData();
  
  // Set in both storages just to be safe
  sessionStorage.setItem("sw_session_v1", userId);
  localStorage.setItem("sw_session_v1_fallback", userId);
  
  // 1. Check if there is a 'next' parameter in the URL (e.g., /signin?next=/checkout?carId=1)
  const urlParams = new URLSearchParams(window.location.search);
  const next = urlParams.get("next");

  // 2. Safely redirect if 'next' exists and is a safe internal path (starts with '/' but not '//')
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    window.location.href = next;
    return;
  }
  
  // 3. Fallback to default role-based dashboards
  if (userId === "admin-1") {
    window.location.href = "/dashboard/admin";
  } else if (userId === "owner-1") {
    window.location.href = "/dashboard/owner";
  } else {
    window.location.href = "/dashboard/renter";
  }
};

export const signOut = () => {
  sessionStorage.removeItem("sw_session_v1");
  localStorage.removeItem("sw_session_v1_fallback");
  window.location.href = "/";
};