import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { ORDERS, NOTIFICATIONS, Order, Notification } from "@/lib/mock-data";

interface AppContextValue {
  orders: Order[];
  notifications: Notification[];
  fuelRequested: boolean;
  breakRequested: boolean;
  fuelStopVisible: boolean;
  setFuelRequested: (v: boolean) => void;
  setBreakRequested: (v: boolean) => void;
  requestFuelStop: () => void;
  dismissNotification: (id: string) => void;
  acknowledgeNotification: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders] = useState<Order[]>(ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [fuelRequested, setFuelRequested] = useState(false);
  const [breakRequested, setBreakRequested] = useState(false);
  const [fuelStopVisible, setFuelStopVisible] = useState(false);

  const requestFuelStop = () => {
    setFuelStopVisible(true);
    setFuelRequested(true);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const acknowledgeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      orders,
      notifications,
      fuelRequested,
      breakRequested,
      fuelStopVisible,
      setFuelRequested,
      setBreakRequested,
      requestFuelStop,
      dismissNotification,
      acknowledgeNotification,
      unreadCount,
    }),
    [orders, notifications, fuelRequested, breakRequested, fuelStopVisible]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
