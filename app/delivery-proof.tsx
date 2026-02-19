import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";

export default function DeliveryProofScreen() {
  const insets = useSafeAreaInsets();
  const [proofImage, setProofImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProofImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Delivery Confirmed", "Proof has been uploaded successfully.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Feather name="check-circle" size={32} color={Colors.success} />
          </View>
          <Text style={styles.heroTitle}>Delivery Proof</Text>
          <Text style={styles.heroSubtitle}>
            Upload photo evidence to confirm delivery
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.uploadArea,
            proofImage && styles.uploadAreaFilled,
            { opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={pickImage}
        >
          {proofImage ? (
            <View style={styles.uploadedContent}>
              <Feather name="image" size={40} color={Colors.success} />
              <Text style={styles.uploadedText}>Photo selected</Text>
              <Text style={styles.uploadedSubtext}>Tap to change</Text>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <View style={styles.uploadIconWrap}>
                <Feather name="camera" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.uploadText}>Tap to upload delivery proof</Text>
              <Text style={styles.uploadSubtext}>Photo of delivered package</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.infoCard}>
          <Feather name="info" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>
            Please ensure the photo clearly shows the package at the delivery location.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            !proofImage && styles.submitBtnDisabled,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleSubmit}
          disabled={!proofImage}
        >
          <Feather name="upload" size={18} color={Colors.white} />
          <Text style={styles.submitBtnText}>Submit Proof</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.reportBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.push("/exception")}
        >
          <Feather name="alert-triangle" size={16} color={Colors.danger} />
          <Text style={styles.reportBtnText}>Report Exception</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: 10,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    textAlign: "center",
  },
  uploadArea: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadAreaFilled: {
    borderColor: Colors.success,
    borderStyle: "solid",
    backgroundColor: Colors.success + "08",
  },
  uploadContent: {
    alignItems: "center",
    gap: 12,
  },
  uploadIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  uploadSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
  },
  uploadedContent: {
    alignItems: "center",
    gap: 8,
  },
  uploadedText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.success,
  },
  uploadedSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary,
    lineHeight: 19,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
  },
  reportBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.danger,
  },
});
