import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { DRIVER } from "@/lib/mock-data";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{DRIVER.avatar}</Text>
          </View>
          <Text style={styles.name}>{DRIVER.name}</Text>
          <Text style={styles.driverId}>{DRIVER.id}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: Colors.primaryLight }]}>
              <Feather name="truck" size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Vehicle</Text>
              <Text style={styles.infoValue}>{DRIVER.vehicle}</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: Colors.success + "15" }]}>
              <Feather name="map-pin" size={18} color={Colors.success} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Hub</Text>
              <Text style={styles.infoValue}>{DRIVER.hub}</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: Colors.warning + "15" }]}>
              <Ionicons name="star-outline" size={18} color={Colors.warning} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>4.8 / 5.0</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: Colors.orange + "15" }]}>
              <Feather name="award" size={18} color={Colors.orange} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Deliveries</Text>
              <Text style={styles.infoValue}>1,247 completed</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  driverId: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.darkGrey,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
  },
});
