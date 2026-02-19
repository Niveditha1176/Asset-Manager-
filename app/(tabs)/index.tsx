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
import OrderCard from "@/components/OrderCard";
import VoiceBotFAB from "@/components/VoiceBotFAB";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    orders,
    fuelRequested,
    breakRequested,
    setFuelRequested,
    setBreakRequested,
    requestFuelStop,
  } = useApp();

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
        <View style={styles.greetingSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>RK</Text>
          </View>
          <View style={styles.greetingInfo}>
            <Text style={styles.greetingLabel}>Good Morning</Text>
            <Text style={styles.driverName}>Rajesh Kumar</Text>
          </View>
          <View style={styles.driverBadge}>
            <Feather name="truck" size={14} color={Colors.primary} />
            <Text style={styles.badgeText}>DRV-4821</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{enRouteOrders.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingOrders.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedOrders.length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAccent]}>
            <Text style={[styles.statNumber, { color: Colors.primary }]}>
              {orders.length}
            </Text>
            <Text style={[styles.statLabel, { color: Colors.primary }]}>Total</Text>
          </View>
        </View>

        <View style={styles.toggleSection}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.orange + "15" }]}>
                <Ionicons name="flame-outline" size={18} color={Colors.orange} />
              </View>
              <Text style={styles.toggleLabel}>Request Fuel</Text>
            </View>
            <Switch
              value={fuelRequested}
              onValueChange={toggleFuel}
              trackColor={{ false: "#E5E7EB", true: Colors.primaryLight }}
              thumbColor={fuelRequested ? Colors.primary : "#fff"}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.success + "15" }]}>
                <Ionicons name="cafe-outline" size={18} color={Colors.success} />
              </View>
              <Text style={styles.toggleLabel}>Request Break</Text>
            </View>
            <Switch
              value={breakRequested}
              onValueChange={toggleBreak}
              trackColor={{ false: "#E5E7EB", true: Colors.primaryLight }}
              thumbColor={breakRequested ? Colors.primary : "#fff"}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.fuelButton,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestFuelStop();
          }}
        >
          <Ionicons name="flash" size={20} color={Colors.white} />
          <Text style={styles.fuelButtonText}>
            {fuelRequested ? "FUEL STOP REQUESTED" : "FUEL NEEDED"}
          </Text>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.sectionTitle}>En Route</Text>
            <Text style={styles.sectionCount}>{enRouteOrders.length}</Text>
          </View>
          {enRouteOrders.map((order) => (
            <OrderCard key={order.id} order={order} variant="en_route" />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <Text style={styles.sectionCount}>{upcomingOrders.length}</Text>
          </View>
          {upcomingOrders.map((order) => (
            <OrderCard key={order.id} order={order} variant="upcoming" />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.sectionTitle}>Completed</Text>
            <Text style={styles.sectionCount}>{completedOrders.length}</Text>
          </View>
          {completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} variant="completed" />
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
  greetingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  greetingInfo: {
    flex: 1,
    marginLeft: 14,
  },
  greetingLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
  },
  driverName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginTop: 2,
  },
  driverBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statCardAccent: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary + "30",
  },
  statNumber: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    marginTop: 2,
  },
  toggleSection: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 14,
  },
  fuelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fuelButtonText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    letterSpacing: 1,
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
});
