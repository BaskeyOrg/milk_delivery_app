import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
import { useLocationContext } from "@/providers/LocationProvider";

type Props = {
  onPress: () => void;
};

export default function LocationHeader({ onPress }: Props) {
  const { selectedAddress } = useLocationContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-2"
    >
      <Ionicons name="location-outline" size={18} color="#1DB954" />
      <Text className="text-text-secondary text-sm">Delivery to</Text>
      <Text
        className="text-text-primary font-semibold max-w-[180px]"
        numberOfLines={1}
      >
        {selectedAddress ?? "Select location"}
      </Text>
      <Ionicons name="chevron-down" size={18} color="#999" />
    </TouchableOpacity>
  );
}
