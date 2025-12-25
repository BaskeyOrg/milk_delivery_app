import { Tables } from "@/assets/data/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Address = Tables<"addresses">;

type Props = {
  address: Address;
};

export default function OrderAddressCard({ address }: Props) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-3">
            <Ionicons name="location" size={24} color="#1DB954" />
          </View>

          <Text className="text-text-primary font-bold text-lg">
            Delivery Address
          </Text>
        </View>

        {address.label && (
          <View className="bg-primary px-3 py-1 rounded-full">
            <Text className="text-background text-xs font-bold">
              {address.label}
            </Text>
          </View>
        )}
      </View>

      {/* Address Details */}
      <View className="ml-15">
        <Text className="text-text-primary font-semibold mb-1">
          {address.full_name}
        </Text>

        <Text className="text-text-secondary text-sm mb-1">
          {address.street}
        </Text>

        <Text className="text-text-secondary text-sm mb-2">
          {address.city}, {address.state} {address.zip_code}
        </Text>

        <View className="flex-row items-center">
          <Ionicons
            name="call"
            size={16}
            color="#6B7280"
            style={{ marginRight: 6 }}
          />
          <Text className="text-text-secondary text-sm">
            {address.phone}
          </Text>
        </View>
      </View>
    </View>
  );
}
