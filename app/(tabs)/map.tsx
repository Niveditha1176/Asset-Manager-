import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/lib/app-context";
import VoiceBotFAB from "@/components/VoiceBotFAB";
import { router } from "expo-router";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_MIN = 200;
const SHEET_MAX = SCREEN_HEIGHT * 0.55;

function UrgentMarkerPulse() {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 2 - pulseScale.value,
  }));

  return (
    <View style={mapStyles.urgentMarkerContainer}>
      <Animated.View style={[mapStyles.urgentMarkerPulse, pulseStyle]} />
      <View style={mapStyles.urgentMarker}>
        <Ionicons name="warning" size={14} color={Colors.white} />
      </View>
      <View style={mapStyles.urgentMarkerLabel}>
        <Text style={mapStyles.urgentMarkerText}>URGENT</Text>
      </View>
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { orders, fuelStopVisible, urgentMarkerVisible, urgentOrder } = useApp();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const enRouteOrder = orders.find((o) => o.status === "en_route");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const sheetHeight = useSharedValue(SHEET_MIN);
  const sheetStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
  }));

  const toggleSheet = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !sheetExpanded;
    setSheetExpanded(next);
    sheetHeight.value = withSpring(next ? SHEET_MAX : SHEET_MIN, {
      damping: 20,
      stiffness: 150,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mapArea, { paddingTop: insets.top + webTopInset }]}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={styles.mapGridLine} />
            ))}
          </View>

          <View style={styles.routeLine} />
          <View style={styles.routeLineH} />

          {urgentMarkerVisible && (
            <View style={mapStyles.urgentRouteSeg}>
              <View style={mapStyles.urgentRouteLineV} />
              <View style={mapStyles.urgentRouteLineH} />
            </View>
          )}

          <View style={styles.startMarker}>
            <Ionicons name="navigate" size={16} color={Colors.white} />
          </View>

          <View style={styles.endMarker}>
            <Feather name="map-pin" size={16} color={Colors.white} />
          </View>

          {fuelStopVisible && (
            <View style={styles.fuelMarker}>
              <Ionicons name="flame" size={14} color={Colors.white} />
              <View style={styles.fuelLabel}>
                <Text style={styles.fuelLabelText}>Fuel Stop</Text>
              </View>
            </View>
          )}

          {urgentMarkerVisible && <UrgentMarkerPulse />}

          <View style={styles.mapOverlayTop}>
            <View style={styles.etaBanner}>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
              <Text style={styles.etaText}>
                {enRouteOrder?.eta || "-- min"} away
              </Text>
              {urgentMarkerVisible && (
                <View style={mapStyles.etaUrgentBadge}>
                  <Text style={mapStyles.etaUrgentText}>+URGENT</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.sidebarToggle, { top: insets.top + 16 + webTopInset }]}
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <Feather name={sidebarOpen ? "x" : "menu"} size={22} color={Colors.textPrimary} />
        </Pressable>

        {sidebarOpen && (
          <View style={[styles.sidebar, { top: insets.top + 60 + webTopInset }]}>
            <Pressable
              style={styles.sidebarItem}
              onPress={() => {
                setSidebarOpen(false);
                router.push("/profile");
              }}
            >
              <Feather name="user" size={20} color={Colors.textPrimary} />
              <Text style={styles.sidebarText}>Profile</Text>
            </Pressable>
            <Pressable
              style={styles.sidebarItem}
              onPress={() => {
                setSidebarOpen(false);
                router.push("/settings");
              }}
            >
              <Feather name="settings" size={20} color={Colors.textPrimary} />
              <Text style={styles.sidebarText}>Settings</Text>
            </Pressable>
            <Pressable
              style={styles.sidebarItem}
              onPress={() => {
                setSidebarOpen(false);
                router.push("/(tabs)/notifications");
              }}
            >
              <Feather name="bell" size={20} color={Colors.textPrimary} />
              <Text style={styles.sidebarText}>Notifications</Text>
            </Pressable>
            <View style={styles.sidebarDivider} />
            <Pressable style={styles.sidebarItem}>
              <Feather name="log-out" size={20} color={Colors.danger} />
              <Text style={[styles.sidebarText, { color: Colors.danger }]}>Logout</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Animated.View style={[styles.bottomSheet, sheetStyle]}>
        <Pressable onPress={toggleSheet} style={styles.sheetHandle}>
          <View style={styles.handleBar} />
        </Pressable>

        <ScrollView
          style={styles.sheetContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={sheetExpanded}
        >
          {enRouteOrder ? (
            <>
              <View style={styles.orderHeader}>
                <View style={styles.orderLive}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.orderIdText}>{enRouteOrder.id}</Text>
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Feather name="user" size={16} color={Colors.darkGrey} />
                  <View>
                    <Text style={styles.detailLabel}>Customer</Text>
                    <Text style={styles.detailValue}>{enRouteOrder.customerName}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Feather name="map-pin" size={16} color={Colors.darkGrey} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>Address</Text>
                    <Text style={styles.detailValue}>{enRouteOrder.address}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Feather name="clock" size={16} color={Colors.darkGrey} />
                  <View>
                    <Text style={styles.detailLabel}>ETA</Text>
                    <Text style={[styles.detailValue, { color: Colors.primary }]}>
                      {enRouteOrder.eta}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Feather name="calendar" size={16} color={Colors.darkGrey} />
                  <View>
                    <Text style={styles.detailLabel}>Time Window</Text>
                    <Text style={styles.detailValue}>{enRouteOrder.timeWindow}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Feather name="package" size={16} color={Colors.darkGrey} />
                  <View>
                    <Text style={styles.detailLabel}>Package ID</Text>
                    <Text style={styles.detailValue}>{enRouteOrder.packageId}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    styles.primaryBtn,
                    { opacity: pressed ? 0.9 : 1 },
                  ]}
                  onPress={() => router.push("/delivery-proof")}
                >
                  <Feather name="check-circle" size={18} color={Colors.white} />
                  <Text style={styles.primaryBtnText}>Arrived</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    styles.outlineBtn,
                    { opacity: pressed ? 0.9 : 1 },
                  ]}
                  onPress={() => router.push("/exception")}
                >
                  <Feather name="alert-triangle" size={18} color={Colors.danger} />
                  <Text style={styles.outlineBtnText}>Report</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.noOrder}>
              <Feather name="check-circle" size={40} color={Colors.success} />
              <Text style={styles.noOrderText}>All deliveries complete</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      <VoiceBotFAB />
    </View>
  );
}

const mapStyles = StyleSheet.create({
  urgentMarkerContainer: {
    position: "absolute",
    top: "35%",
    left: "30%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  urgentMarkerPulse: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(239, 68, 68, 0.25)",
  },
  urgentMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  urgentMarkerLabel: {
    position: "absolute",
    top: -20,
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentMarkerText: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    letterSpacing: 1,
  },
  urgentRouteSeg: {
    position: "absolute",
    top: "30%",
    left: "20%",
    width: "40%",
    height: "30%",
  },
  urgentRouteLineV: {
    position: "absolute",
    top: 0,
    left: "30%",
    width: 3,
    height: "60%",
    backgroundColor: Colors.danger,
    borderRadius: 2,
    opacity: 0.5,
  },
  urgentRouteLineH: {
    position: "absolute",
    top: "30%",
    left: 0,
    width: "55%",
    height: 3,
    backgroundColor: Colors.danger,
    borderRadius: 2,
    opacity: 0.5,
  },
  etaUrgentBadge: {
    backgroundColor: Colors.danger + "18",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  etaUrgentText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: Colors.danger,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  mapArea: {
    flex: 1,
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#E8EEF4",
    position: "relative",
    overflow: "hidden",
  },
  mapGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mapGridLine: {
    width: "25%",
    height: "25%",
    borderWidth: 0.5,
    borderColor: "rgba(37, 99, 235, 0.08)",
  },
  routeLine: {
    position: "absolute",
    top: "30%",
    left: "20%",
    width: 3,
    height: "40%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
    opacity: 0.6,
  },
  routeLineH: {
    position: "absolute",
    top: "50%",
    left: "20%",
    width: "50%",
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    opacity: 0.6,
  },
  startMarker: {
    position: "absolute",
    top: "25%",
    left: "16%",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  endMarker: {
    position: "absolute",
    top: "45%",
    left: "66%",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fuelMarker: {
    position: "absolute",
    top: "38%",
    left: "40%",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fuelLabel: {
    position: "absolute",
    top: -22,
    backgroundColor: Colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fuelLabelText: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
  mapOverlayTop: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  etaBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  etaText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  sidebarToggle: {
    position: "absolute",
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sidebar: {
    position: "absolute",
    left: 16,
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
  },
  sidebarText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.textPrimary,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 14,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  sheetContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  orderLive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
  liveText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: Colors.danger,
    letterSpacing: 1,
  },
  orderIdText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.darkGrey,
  },
  detailGrid: {
    gap: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
  outlineBtn: {
    backgroundColor: "#FEE2E2",
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.danger,
  },
  noOrder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: 12,
  },
  noOrderText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: Colors.darkGrey,
  },
});
