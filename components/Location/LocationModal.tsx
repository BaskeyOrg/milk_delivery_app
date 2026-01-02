import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Tables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useLocationContext } from "@/providers/LocationProvider";

type Address = Tables<"addresses">;

export default function LocationModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { session } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const { setCurrentLocation, setSelectedAddress } = useLocationContext();

  /* ---------------- FETCH SAVED ADDRESSES ---------------- */

  useEffect(() => {
    if (!visible || !session) return;

    const fetchAddresses = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAddresses(data); // now TypeScript is happy
      }

      setLoading(false);
    };

    fetchAddresses();
  }, [visible, session]);

  /* ---------------- HANDLERS ---------------- */

  const handleUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    router.push({
      pathname: "/locationMap",
      params: {
        lat: latitude.toString(),
        lng: longitude.toString(),
      },
    });

    onClose();
  };

  const formatPhone = (phone: string) =>
    phone.replace(/\D/g, "").replace(/(\d{5})(\d{5})/, "$1 $2");

  const handleSelectAddress = (addr: Address) => {
    if (addr.latitude == null || addr.longitude == null) {
      Alert.alert(
        "Location unavailable",
        "This address does not have a valid location."
      );
      return;
    }
    setCurrentLocation({ latitude: addr.latitude, longitude: addr.longitude });
    setSelectedAddress(`${addr.flat}, ${addr.area}`);
    onClose();
  };

  /* ---------------- UI ---------------- */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="bg-background rounded-t-3xl p-6 relative">
              {/* Floating Close Button */}
              <Pressable
                onPress={onClose}
                className="absolute -top-14 self-center bg-background rounded-full p-3 shadow-lg"
              >
                <Ionicons name="close" size={22} color="#666" />
              </Pressable>

              {/* Title */}
              <Text className="text-xl font-bold text-text-primary mb-4">
                Choose delivery location
              </Text>

              {/* Search Placeholder */}
              <View className="bg-background-muted rounded-xl px-4 py-3 mb-4">
                <Text className="text-text-secondary">
                  🔍 Search location (coming soon)
                </Text>
              </View>

              {/* ✅ SAVED ADDRESSES (ADDED ONLY) */}
              {addresses.length > 0 && (
                <>
                  <Text className="text-text-secondary mb-2">
                    Your saved addresses
                  </Text>

                  <ScrollView
                    className="mb-3"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 220 }}
                  >
                    {addresses.map((addr) => (
                      <TouchableOpacity
                        key={addr.id}
                        onPress={() => handleSelectAddress(addr)}
                        className="bg-background-subtle rounded-xl p-4 mb-3"
                      >
                        <Text className="font-semibold text-text-primary">
                          {addr.name}
                        </Text>

                        <Text
                          numberOfLines={2}
                          className="text-text-secondary text-sm mt-1"
                        >
                          {addr.flat}, {addr.area}
                        </Text>

                        <Text className="text-text-secondary text-sm mt-1">
                          Phone number: {formatPhone(addr.phone)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}

              {/* 🔹 OLD BUTTON — UNCHANGED */}
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                className="flex-row items-center justify-between py-4"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="locate-outline" size={22} color="#1DB954" />
                  <Text className="text-text-primary font-semibold">
                    Use current location
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity onPress={onClose} className="mt-6">
                <Text className="text-center text-text-secondary">Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
