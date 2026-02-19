import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/lib/app-context";
import { useAuth } from "@/lib/auth-context";
import { router } from "expo-router";
import VoiceBotFAB from "@/components/VoiceBotFAB";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    orders,
    fuelRequested,
    breakRequested,
    setFuelRequested,
    setBreakRequested,
  } = useApp();
  const { user } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const enRouteOrders = orders.filter((o) => o.status === "en_route");
  const upcomingOrders = orders.filter((o) => o.status === "upcoming");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const toggleFuel = (val: boolean) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFuelRequested(val);
  };

  const toggleBreak = (val: boolean) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBreakRequested(val);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16 + webTopInset, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{user?.name || "Driver"}</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En Route</Text>
            </View>
          </View>
          <View style={styles.topActions}>
            <Pressable style={styles.iconBtn} onPress={toggleFuel.bind(null, !fuelRequested)}>
              <Ionicons name="flame-outline" size={20} color={fuelRequested ? Colors.orange : Colors.darkGrey} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={toggleBreak.bind(null, !breakRequested)}>
              <Ionicons name="cafe-outline" size={20} color={breakRequested ? Colors.success : Colors.darkGrey} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.sectionTitle}>En Route</Text>
            <Text style={styles.sectionCount}>{enRouteOrders.length}</Text>
          </View>
          {enRouteOrders.map((order) => (
            <Pressable
              key={order.id}
              style={styles.orderCard}
              onPress={() => router.push("/(tabs)/map")}
              testID={`order-${order.id}`}
            >
              <View style={styles.orderCardHeader}>
                <View style={styles.orderLiveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.orderId}>{order.id}</Text>
              </View>
              <Text style={styles.orderCustomer}>{order.customerName}</Text>
              <Text style={styles.orderAddress}>{order.address}</Text>
              <View style={styles.orderMeta}>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={13} color={Colors.primary} />
                  <Text style={styles.metaText}>{order.eta}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="package" size={13} color={Colors.darkGrey} />
                  <Text style={styles.metaTextSub}>{order.packageId}</Text>
                </View>
              </View>
              <View style={styles.orderDetailBtn}>
                <Text style={styles.orderDetailBtnText}>Order Details</Text>
                <Feather name="chevron-right" size={16} color={Colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <Text style={styles.sectionCount}>{upcomingOrders.length}</Text>
          </View>
          {upcomingOrders.map((order) => (
            <Pressable
              key={order.id}
              style={[styles.orderCard, styles.orderCardUpcoming]}
              onPress={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <View style={styles.orderCardHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                {order.isUrgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.orderCustomer}>{order.customerName}</Text>
              <Text style={styles.orderAddress}>{order.address}</Text>
              {expandedOrder === order.id && (
                <View style={styles.expandedDetails}>
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={13} color={Colors.darkGrey} />
                    <Text style={styles.metaTextSub}>{order.timeWindow}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name="package" size={13} color={Colors.darkGrey} />
                    <Text style={styles.metaTextSub}>{order.packageId}</Text>
                  </View>
                  {order.weight && (
                    <View style={styles.metaItem}>
                      <Feather name="box" size={13} color={Colors.darkGrey} />
                      <Text style={styles.metaTextSub}>{order.weight}</Text>
                    </View>
                  )}
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.sectionTitle}>Past Completed</Text>
            <Text style={styles.sectionCount}>{completedOrders.length}</Text>
          </View>
          {completedOrders.map((order) => (
            <Pressable
              key={order.id}
              style={[styles.orderCard, styles.orderCardCompleted]}
              onPress={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <View style={styles.orderCardHeader}>
                <Text style={[styles.orderId, { color: Colors.darkGrey }]}>{order.id}</Text>
                <Feather name="check-circle" size={16} color={Colors.success} />
              </View>
              <Text style={[styles.orderCustomer, { color: Colors.darkGrey }]}>{order.customerName}</Text>
              <Text style={styles.orderAddress}>{order.address}</Text>
              {expandedOrder === order.id && (
                <View style={styles.expandedDetails}>
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={13} color={Colors.darkGrey} />
                    <Text style={styles.metaTextSub}>{order.timeWindow}</Text>
                  </View>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <VoiceBotFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.success,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    flex: 1,
  },
  sectionCount: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.darkGrey,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: "hidden",
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  orderCardUpcoming: {
    borderLeftColor: Colors.warning,
  },
  orderCardCompleted: {
    borderLeftColor: Colors.success,
    opacity: 0.8,
  },
  orderCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
  liveText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: Colors.danger,
    letterSpacing: 1,
  },
  orderId: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  urgentBadge: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    letterSpacing: 1,
  },
  orderCustomer: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    marginBottom: 10,
    lineHeight: 18,
  },
  orderMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  metaTextSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
  },
  orderDetailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 10,
    borderRadius: 10,
  },
  orderDetailBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  expandedDetails: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 10,
    gap: 8,
  },
});
