import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LocationModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* BACKDROP (click outside closes) */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">

          {/* PREVENT CLOSE WHEN CLICKING CONTENT */}
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

              {/* Use current location */}
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                className="flex-row items-center justify-between py-4"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons
                    name="locate-outline"
                    size={22}
                    color="#1DB954"
                  />
                  <Text className="text-text-primary font-semibold">
                    Use current location
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity onPress={onClose} className="mt-6">
                <Text className="text-center text-text-secondary">
                  Cancel
                </Text>
              </TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
