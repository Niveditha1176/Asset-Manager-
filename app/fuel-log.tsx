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
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";

export default function FuelLogScreen() {
  const [meterPhoto, setMeterPhoto] = useState(false);
  const [paymentPhoto, setPaymentPhoto] = useState(false);

  const pickMeterPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setMeterPhoto(true);
    }
  };

  const pickPaymentPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPaymentPhoto(true);
    }
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Fuel Log Submitted", "Your fuel stop has been recorded.", [
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
            <Ionicons name="flame" size={30} color={Colors.orange} />
          </View>
          <Text style={styles.heroTitle}>Fuel Stop Reached</Text>
          <Text style={styles.heroSubtitle}>
            Upload the required photos to log your fuel stop
          </Text>
        </View>

        <View style={styles.uploadsContainer}>
          <Pressable
            style={[styles.uploadCard, meterPhoto && styles.uploadCardDone]}
            onPress={pickMeterPhoto}
          >
            <View style={[styles.uploadIconBox, meterPhoto && styles.uploadIconBoxDone]}>
              <Feather
                name={meterPhoto ? "check" : "camera"}
                size={24}
                color={meterPhoto ? Colors.white : Colors.orange}
              />
            </View>
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadTitle}>Bunk Meter Photo</Text>
              <Text style={styles.uploadSubtext}>
                {meterPhoto ? "Photo uploaded" : "Take a photo of the meter reading"}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={meterPhoto ? Colors.success : Colors.darkGrey}
            />
          </Pressable>

          <Pressable
            style={[styles.uploadCard, paymentPhoto && styles.uploadCardDone]}
            onPress={pickPaymentPhoto}
          >
            <View style={[styles.uploadIconBox, paymentPhoto && styles.uploadIconBoxDone]}>
              <Feather
                name={paymentPhoto ? "check" : "credit-card"}
                size={24}
                color={paymentPhoto ? Colors.white : Colors.orange}
              />
            </View>
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadTitle}>Payment Screenshot</Text>
              <Text style={styles.uploadSubtext}>
                {paymentPhoto ? "Screenshot uploaded" : "Upload payment receipt"}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={paymentPhoto ? Colors.success : Colors.darkGrey}
            />
          </Pressable>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: meterPhoto && paymentPhoto ? "100%" : meterPhoto || paymentPhoto ? "50%" : "0%",
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {meterPhoto && paymentPhoto
            ? "All photos uploaded"
            : `${(meterPhoto ? 1 : 0) + (paymentPhoto ? 1 : 0)} of 2 photos uploaded`}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            !(meterPhoto && paymentPhoto) && styles.submitBtnDisabled,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleSubmit}
          disabled={!(meterPhoto && paymentPhoto)}
        >
          <Feather name="upload" size={18} color={Colors.white} />
          <Text style={styles.submitBtnText}>Submit Fuel Log</Text>
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
    marginBottom: 32,
    marginTop: 10,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.orange + "15",
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
  uploadsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  uploadCardDone: {
    borderColor: Colors.success + "50",
    backgroundColor: Colors.success + "08",
  },
  uploadIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.orange + "15",
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
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.darkGrey,
    textAlign: "center",
    marginBottom: 28,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.orange,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: Colors.orange,
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
});
