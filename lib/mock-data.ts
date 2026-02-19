export interface Order {
  id: string;
  customerName: string;
  address: string;
  eta: string;
  timeWindow: string;
  packageId: string;
  status: "en_route" | "upcoming" | "completed";
  lat: number;
  lng: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "urgent";
}

export const DRIVER = {
  name: "Rajesh Kumar",
  id: "DRV-4821",
  vehicle: "MH-12-AB-1234",
  hub: "Andheri East Hub",
  avatar: "RK",
};

export const ORDERS: Order[] = [
  {
    id: "ORD-7891",
    customerName: "Priya Sharma",
    address: "402, Sunshine Towers, Bandra West",
    eta: "12 min",
    timeWindow: "10:00 AM - 11:00 AM",
    packageId: "PKG-44210",
    status: "en_route",
    lat: 19.0596,
    lng: 72.8295,
  },
  {
    id: "ORD-7892",
    customerName: "Amit Patel",
    address: "B-12, Galaxy Apartments, Juhu",
    eta: "35 min",
    timeWindow: "11:00 AM - 12:00 PM",
    packageId: "PKG-44211",
    status: "upcoming",
    lat: 19.0883,
    lng: 72.8263,
  },
  {
    id: "ORD-7893",
    customerName: "Neha Gupta",
    address: "15, Sea View Road, Versova",
    eta: "55 min",
    timeWindow: "12:00 PM - 1:00 PM",
    packageId: "PKG-44212",
    status: "upcoming",
    lat: 19.1325,
    lng: 72.8125,
  },
  {
    id: "ORD-7894",
    customerName: "Vikram Singh",
    address: "303, Pearl Heights, Andheri West",
    eta: "1h 20m",
    timeWindow: "1:00 PM - 2:00 PM",
    packageId: "PKG-44213",
    status: "upcoming",
    lat: 19.1197,
    lng: 72.8368,
  },
  {
    id: "ORD-7895",
    customerName: "Sanjay Mehta",
    address: "7, Hill Road, Worli",
    eta: "--",
    timeWindow: "8:00 AM - 9:00 AM",
    packageId: "PKG-44208",
    status: "completed",
    lat: 19.0176,
    lng: 72.8151,
  },
  {
    id: "ORD-7896",
    customerName: "Kavita Desai",
    address: "901, Ocean View, Dadar",
    eta: "--",
    timeWindow: "9:00 AM - 10:00 AM",
    packageId: "PKG-44209",
    status: "completed",
    lat: 19.0178,
    lng: 72.8478,
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "NOT-001",
    title: "Route Update",
    message: "Your route has been optimized. 2 new stops added near Bandra.",
    time: "2 min ago",
    read: false,
    type: "info",
  },
  {
    id: "NOT-002",
    title: "Priority Delivery",
    message: "ORD-7891 marked as priority. Customer requested early delivery.",
    time: "15 min ago",
    read: false,
    type: "urgent",
  },
  {
    id: "NOT-003",
    title: "Traffic Alert",
    message: "Heavy congestion on Western Express Highway. Consider alternate route via SV Road.",
    time: "30 min ago",
    read: false,
    type: "warning",
  },
  {
    id: "NOT-004",
    title: "Break Reminder",
    message: "You have been driving for 3 hours. Please take a 15-minute break.",
    time: "1h ago",
    read: true,
    type: "info",
  },
  {
    id: "NOT-005",
    title: "Fuel Level Low",
    message: "Vehicle fuel level estimated at 15%. Nearest fuel station: Shell, Andheri.",
    time: "2h ago",
    read: true,
    type: "warning",
  },
];

export const LEAVE_REASONS = [
  "Personal Leave",
  "Sick Leave",
  "Family Emergency",
  "Medical Appointment",
  "Other",
];

export const EXCEPTION_TYPES = [
  { id: "road_blocked", label: "Road Blocked", icon: "alert-triangle" as const },
  { id: "customer_not_home", label: "Customer Not Home", icon: "user-x" as const },
  { id: "return_to_origin", label: "Return to Origin", icon: "rotate-ccw" as const },
  { id: "other", label: "Other", icon: "more-horizontal" as const },
];
