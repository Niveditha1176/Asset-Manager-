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
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { EXCEPTION_TYPES } from "@/lib/mock-data";
import VoiceBotFAB from "@/components/VoiceBotFAB";

export default function DeliveryProofScreen() {
  const [proofImage, setProofImage] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"proof" | "exception" | null>(null);
  const [exceptionCategory, setExceptionCategory] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProofImage(true);
      setSelectedAction("proof");
    }
  };

  const handleSubmit = () => {
    if (!selectedAction) {
      Alert.alert("Required", "Please upload delivery proof or report an exception.");
      return;
    }
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (selectedAction === "proof") {
      Alert.alert("Delivery Confirmed", "Proof has been uploaded successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Exception Reported", "Your report has been submitted.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Ionicons name="location" size={24} color={Colors.success} />
          <Text style={styles.titleText}>Address Reached</Text>
        </View>

        <Pressable
          style={[
            styles.uploadBtn,
            proofImage && styles.uploadBtnDone,
            selectedAction === "proof" && styles.uploadBtnSelected,
          ]}
          onPress={pickImage}
        >
          <View style={[styles.uploadIconBox, proofImage && styles.uploadIconBoxDone]}>
            <Feather name={proofImage ? "check" : "camera"} size={22} color={proofImage ? Colors.white : Colors.primary} />
          </View>
          <View style={styles.uploadInfo}>
            <Text style={styles.uploadTitle}>Upload</Text>
            <Text style={styles.uploadSubtext}>
              {proofImage ? "Delivery proof uploaded" : "Delivery Proof"}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.darkGrey} />
        </Pressable>

        <Text style={styles.orText}>(or)</Text>

        <Pressable
          style={[
            styles.exceptionBtn,
            selectedAction === "exception" && styles.exceptionBtnSelected,
          ]}
          onPress={() => setSelectedAction("exception")}
        >
          <View style={[styles.uploadIconBox, { backgroundColor: Colors.danger + "15" }]}>
            <Feather name="alert-triangle" size={22} color={Colors.danger} />
          </View>
          <View style={styles.uploadInfo}>
            <Text style={styles.uploadTitle}>Report Exception</Text>
            <Text style={styles.uploadSubtext}>Should definitely pick one of two</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.darkGrey} />
        </Pressable>

        {selectedAction === "exception" && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <Pressable
                style={styles.inputWrapper}
                onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <Text style={[styles.dropdownText, !exceptionCategory && { color: "#9CA3AF" }]}>
                  {exceptionCategory || "Select category"}
                </Text>
                <Feather
                  name={categoryDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.darkGrey}
                />
              </Pressable>
              {categoryDropdownOpen && (
                <View style={styles.dropdown}>
                  {EXCEPTION_TYPES.map((et) => (
                    <Pressable
                      key={et.id}
                      style={[styles.dropdownItem, exceptionCategory === et.label && styles.dropdownItemActive]}
                      onPress={() => {
                        setExceptionCategory(et.label);
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, exceptionCategory === et.label && styles.dropdownItemTextActive]}>
                        {et.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Text</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add notes or description..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            !selectedAction && styles.submitBtnDisabled,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleSubmit}
          disabled={!selectedAction}
        >
          <Text style={styles.submitBtnText}>Submit</Text>
        </Pressable>
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
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  titleText: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginBottom: 8,
  },
  uploadBtnDone: {
    borderColor: Colors.success + "50",
    backgroundColor: Colors.success + "08",
  },
  uploadBtnSelected: {
    borderColor: Colors.primary,
  },
  uploadIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIconBoxDone: {
    backgroundColor: Colors.success,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.darkGrey,
    marginVertical: 8,
  },
  exceptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  exceptionBtnSelected: {
    borderColor: Colors.danger,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  dropdownItem: {
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
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 100,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
});
