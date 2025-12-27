import { useLocationContext } from "@/providers/LocationProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function LocationHeaderContent({
  onPress,
}: {
  onPress: () => void;
}) {
  const { selectedAddress } = useLocationContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center"
      activeOpacity={0.7}
    >
      <Ionicons name="location-sharp" size={18} color="#fff" />

      <View className="ml-2">
        <Text className="text-white text-xs opacity-80">
          Delivery to
        </Text>
        <Text
          className="text-white font-semibold max-w-[220px]"
          numberOfLines={1}
        >
          {selectedAddress ?? "Select location"}
        </Text>
      </View>

      <Ionicons name="chevron-down" size={20} color="#fff" />
    </TouchableOpacity>
  );
}
