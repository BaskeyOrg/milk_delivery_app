import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

export default function LocationModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleUseCurrentLocation = async () => {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Pass location via router params to map screen
    router.push({
      pathname: "/locationMap",
      params: { lat: latitude.toString(), lng: longitude.toString() },
    });

    onClose();
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-background rounded-t-3xl p-6">
          <Text className="text-xl font-bold text-text-primary mb-4">
            Choose delivery location
          </Text>

          {/* Search Placeholder */}
          <View className="bg-surface rounded-xl px-4 py-3 mb-4">
            <Text className="text-text-secondary">
              🔍 Search location (coming soon)
            </Text>
          </View>

          {/* Use current location */}
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

          <TouchableOpacity onPress={onClose} className="mt-6">
            <Text className="text-center text-text-secondary">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
