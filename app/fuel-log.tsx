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
import VoiceBotFAB from "@/components/VoiceBotFAB";

export default function FuelLogScreen() {
  const [proofUploaded, setProofUploaded] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"proof" | "complaint" | null>(null);
  const [notes, setNotes] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setProofUploaded(true);
      setSelectedAction("proof");
    }
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (selectedAction === "complaint") {
      Alert.alert("Complaint Filed", "Your fuel stop complaint has been recorded.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Fuel Log Submitted", "Your fuel stop has been recorded.", [
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
          <Ionicons name="flame" size={24} color={Colors.orange} />
          <Text style={styles.titleText}>Fuel Stop Reached</Text>
        </View>

        <Pressable
          style={[
            styles.actionBtn,
            proofUploaded && styles.actionBtnDone,
            selectedAction === "proof" && styles.actionBtnSelected,
          ]}
          onPress={pickImage}
        >
          <View style={[styles.iconBox, proofUploaded && styles.iconBoxDone]}>
            <Feather
              name={proofUploaded ? "check" : "camera"}
              size={22}
              color={proofUploaded ? Colors.white : Colors.orange}
            />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Upload Proof</Text>
            <Text style={styles.actionSubtext}>
              {proofUploaded ? "Photo uploaded" : "Upload fuel receipt or meter reading"}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.darkGrey} />
        </Pressable>

        <Text style={styles.orText}>(or)</Text>

        <Pressable
          style={[
            styles.actionBtn,
            selectedAction === "complaint" && styles.actionBtnComplaint,
          ]}
          onPress={() => setSelectedAction("complaint")}
        >
          <View style={[styles.iconBox, { backgroundColor: Colors.danger + "15" }]}>
            <Feather name="alert-triangle" size={22} color={Colors.danger} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Report Complaints</Text>
            <Text style={styles.actionSubtext}>Report issues at fuel station</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.darkGrey} />
        </Pressable>

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
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Submit</Text>
        </Pressable>

        <View style={styles.noteBox}>
          <Feather name="info" size={14} color={Colors.primary} />
          <Text style={styles.noteText}>
            After completion, you will be redirected to the homepage.
          </Text>
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
  actionBtn: {
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
  actionBtnDone: {
    borderColor: Colors.success + "50",
    backgroundColor: Colors.success + "08",
  },
  actionBtnSelected: {
    borderColor: Colors.orange,
  },
  actionBtnComplaint: {
    borderColor: Colors.danger,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.orange + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxDone: {
    backgroundColor: Colors.success,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  actionSubtext: {
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
  inputGroup: {
    marginTop: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    marginBottom: 8,
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
    backgroundColor: Colors.orange,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primaryLight,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  noteText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary,
    flex: 1,
  },
});
