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

const getLabelIcon = (label?: string | null) => {
  const value = label?.toLowerCase();
  if (value === "home") return "home";
  if (value === "work" || value === "office") return "briefcase";
  return "location-outline";
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  isUpdatingAddress = false,
  isDeletingAddress = false,
}: Props) {
  return (
    <View className="bg-black/5 rounded-2xl p-5 mt-4">
      {/* HEADER */}
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-row items-center flex-1">
          {/* ICON */}
          <View className="bg-primary/15 rounded-full w-12 h-12 items-center justify-center mr-3">
            <Ionicons name="location" size={22} color="#43ce4e" />
          </View>

          {/* TITLE */}
          <View className="flex-1">
            <Text className="text-gray-900 font-bold text-base">
              Delivery Address
            </Text>

            {address.label && (
              <View className="self-start mt-1 px-3 py-1 rounded-full bg-primary flex-row items-center gap-2">
                <Ionicons
                  name={getLabelIcon(address.label)}
                  size={12}
                  color="#5c5c5cff"
                />
                <Text className="text-background text-xs font-bold">
                  {address.label}
                </Text>
              </View>
            )}
          </View>
        </View>

        {address.is_default && (
          <View className="bg-gray-900 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">Default</Text>
          </View>
        )}
      </View>

      {/* DETAILS */}
      <View className="ml-[60px]">
        <Text className="text-gray-900 font-semibold mb-1">
          {address.full_name}
        </Text>

        {!!address.landmark && (
          <Text className="text-gray-500 text-sm mb-1">
            {address.landmark}
          </Text>
        )}

        <Text className="text-gray-600 text-sm mb-2">
          {address.street}, {address.area}, {address.city}
        </Text>

        <View className="flex-row items-center">
          <Ionicons
            name="call-outline"
            size={14}
            color="#6B7280"
            style={{ marginRight: 6 }}
          />
          <Text className="text-gray-600 text-sm">{address.phone}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View className="flex-row mt-5 gap-3">
        <TouchableOpacity
          className="flex-1 bg-primary/15 py-3 rounded-xl items-center"
          activeOpacity={0.8}
          onPress={() => onEdit(address)}
          disabled={isUpdatingAddress}
        >
          <Text className="text-primary font-bold">
            {isUpdatingAddress ? "Updating..." : "Edit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-red-500/15 py-3 rounded-xl items-center"
          activeOpacity={0.8}
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
