import { Tables } from "@/assets/data/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type Address = Tables<"addresses">;

type Props = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: number, label?: string | null) => void;
  isUpdatingAddress?: boolean;
  isDeletingAddress?: boolean;
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  isUpdatingAddress = false,
  isDeletingAddress = false,
}: Props) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-3">
            <Ionicons name="location" size={24} color="#1DB954" />
          </View>

          <View className="flex-col items-start">
            <Text className="text-text-primary font-bold text-lg">
              Delivery Address
            </Text>
            {address.label && (
              <View className="bg-primary px-3 py-1 rounded-full border flex-row items-center gap-1">
                <Ionicons
                  name={
                    address.label.toLowerCase() === "home"
                      ? "home"
                      : address.label.toLowerCase() === "work" ||
                          address.label.toLowerCase() === "office"
                        ? "briefcase"
                        : "location-outline"
                  }
                  size={12}
                  color="#121212"
                />
                <Text className="text-background text-xs font-bold">
                  {address.label}
                </Text>
              </View>
            )}
          </View>
        </View>

        {address.is_default && (
          <View className="bg-gray-300 px-3 py-1 rounded-full">
            <Text className="text-background text-xs font-bold">
              Default
            </Text>
          </View>
        )}
      </View>

      {/* Address details */}
      <View className="ml-15">
        <Text className="text-text-primary font-semibold mb-1">
          {address.full_name}
        </Text>

        <Text className="text-text-secondary text-sm mb-1">
          {address.landmark}
        </Text>

        <Text className="text-text-secondary text-sm mb-2">
          {address.street}, {address.area}, {address.city} 
        </Text>

        <View className="flex-row items-center">
          <Ionicons
            name="call"
            size={16}
            color="#6B7280"
            style={{ marginRight: 6 }}
          />
          <Text className="text-text-secondary text-sm">{address.phone}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row mt-4 gap-2">
        <TouchableOpacity
          className="flex-1 bg-primary/20 py-3 rounded-xl items-center"
          activeOpacity={0.7}
          onPress={() => onEdit(address)}
          disabled={isUpdatingAddress}
        >
          <Text className="text-primary font-bold">
            {isUpdatingAddress ? "Updating..." : "Edit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-red-500/20 py-3 rounded-xl items-center"
          activeOpacity={0.7}
          onPress={() => onDelete(address.id, address.label)}
          disabled={isDeletingAddress}
        >
          <Text className="text-red-500 font-bold">
            {isDeletingAddress ? "Deleting..." : "Delete"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
