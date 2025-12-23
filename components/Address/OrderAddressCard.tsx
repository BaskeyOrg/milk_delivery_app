import { Tables } from "@/assets/data/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Address = Tables<"addresses">;

type Props = {
  address: Address;
};

export default function OrderAddressCard({ address }: Props) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-700">
      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={18} color="#4F46E5" />
        <Text className="ml-2 font-bold text-gray-900 dark:text-white">
          Delivery Address
        </Text>
      </View>

      <Text className="font-semibold text-gray-800 dark:text-white">
        {address.full_name}
      </Text>

      <Text className="text-gray-600 dark:text-neutral-300 mt-1">
        {address.street}
      </Text>

      <Text className="text-gray-600 dark:text-neutral-300">
        {address.city}, {address.state} - {address.zip_code}
      </Text>
      <View className="flex-row items-center mb-2">
        <Ionicons name="call" size={18} color="#4F46E5" />
        <Text className="ml-2 font-bold text-gray-900 dark:text-white">
          {address.phone}
        </Text>
      </View>

      {address.label && (
        <View className="mt-2 self-start bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
          <Text className="text-xs font-medium text-gray-700 dark:text-neutral-300">
            {address.label}
          </Text>
        </View>
      )}
    </View>
  );
}
