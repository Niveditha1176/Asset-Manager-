import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { LEAVE_REASONS } from "@/lib/mock-data";
import VoiceBotFAB from "@/components/VoiceBotFAB";

export default function FormsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"leave" | "overtime">("leave");

  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);

  const [otFrom, setOtFrom] = useState("");
  const [otTo, setOtTo] = useState("");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const handleGenerateTicket = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Ticket Generated", `Leave request for ${leaveDate || "selected date"} has been submitted.`);
  };

  const handleRequestOvertime = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Overtime Requested", `Request for ${otFrom} to ${otTo} has been submitted.`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 + webTopInset }]}>
        <Text style={styles.headerTitle}>HR & Operations</Text>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setActiveTab("leave")}
          style={[styles.tab, activeTab === "leave" && styles.activeTab]}
        >
          <Feather name="calendar" size={16} color={activeTab === "leave" ? Colors.primary : Colors.darkGrey} />
          <Text style={[styles.tabText, activeTab === "leave" && styles.activeTabText]}>
            Leave
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("overtime")}
          style={[styles.tab, activeTab === "overtime" && styles.activeTab]}
        >
          <Feather name="clock" size={16} color={activeTab === "overtime" ? Colors.primary : Colors.darkGrey} />
          <Text style={[styles.tabText, activeTab === "overtime" && styles.activeTabText]}>
            Overtime
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "leave" ? (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={[styles.formIcon, { backgroundColor: Colors.primaryLight }]}>
                <Feather name="calendar" size={22} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.formTitle}>Leave Application</Text>
                <Text style={styles.formSubtitle}>Submit your leave request</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Date</Text>
              <View style={styles.inputWrapper}>
                <Feather name="calendar" size={18} color={Colors.darkGrey} />
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#9CA3AF"
                  value={leaveDate}
                  onChangeText={setLeaveDate}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason</Text>
              <Pressable
                style={styles.inputWrapper}
                onPress={() => setReasonDropdownOpen(!reasonDropdownOpen)}
              >
                <Feather name="file-text" size={18} color={Colors.darkGrey} />
                <Text style={[styles.dropdownText, !leaveReason && { color: "#9CA3AF" }]}>
                  {leaveReason || "Select reason"}
                </Text>
                <Feather
                  name={reasonDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.darkGrey}
                />
              </Pressable>

              {reasonDropdownOpen && (
                <View style={styles.dropdown}>
                  {LEAVE_REASONS.map((reason) => (
                    <Pressable
                      key={reason}
                      style={[
                        styles.dropdownItem,
                        leaveReason === reason && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setLeaveReason(reason);
                        setReasonDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          leaveReason === reason && styles.dropdownItemTextActive,
                        ]}
                      >
                        {reason}
                      </Text>
                      {leaveReason === reason && (
                        <Feather name="check" size={16} color={Colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
              onPress={handleGenerateTicket}
            >
              <Feather name="send" size={18} color={Colors.white} />
              <Text style={styles.submitBtnText}>Generate Ticket</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={[styles.formIcon, { backgroundColor: Colors.warning + "20" }]}>
                <Feather name="clock" size={22} color={Colors.warning} />
              </View>
              <View>
                <Text style={styles.formTitle}>Overtime Management</Text>
                <Text style={styles.formSubtitle}>Request additional hours</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>From Time</Text>
              <View style={styles.inputWrapper}>
                <Feather name="clock" size={18} color={Colors.darkGrey} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 6:00 PM"
                  placeholderTextColor="#9CA3AF"
                  value={otFrom}
                  onChangeText={setOtFrom}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>To Time</Text>
              <View style={styles.inputWrapper}>
                <Feather name="clock" size={18} color={Colors.darkGrey} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9:00 PM"
                  placeholderTextColor="#9CA3AF"
                  value={otTo}
                  onChangeText={setOtTo}
                />
              </View>
            </View>

            <View style={styles.hoursPreview}>
              <Feather name="info" size={16} color={Colors.primary} />
              <Text style={styles.hoursPreviewText}>
                {otFrom && otTo
                  ? `Overtime: ${otFrom} - ${otTo}`
                  : "Enter times to preview hours"}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: Colors.warning },
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
              onPress={handleRequestOvertime}
            >
              <Feather name="send" size={18} color={Colors.white} />
              <Text style={styles.submitBtnText}>Request Overtime</Text>
            </Pressable>
          </View>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeTab: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary + "40",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.darkGrey,
  },
  activeTabText: {
    color: Colors.primary,
    fontFamily: "Inter_600SemiBold",
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
  },
  formIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  formSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
  },
  dropdownItemTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  hoursPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  hoursPreviewText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.primary,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
});
