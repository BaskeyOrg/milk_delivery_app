import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type OrderBillFooterProps = {
  itemsTotal: number;
  deliveryCharge?: number;
};

const OrderBillFooter = ({
  itemsTotal,
  deliveryCharge = 0,
}: OrderBillFooterProps) => {
  const grandTotal = itemsTotal + deliveryCharge;

  return (
    <View className="mt-4 bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-700">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="receipt-outline" size={18} color="#4F46E5" />
        <Text className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
          Bill Details
        </Text>
      </View>

      {/* Items total */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-600 dark:text-neutral-300">
          Items Total
        </Text>
        <Text className="text-gray-800 dark:text-white font-medium">
          ₹ {itemsTotal.toFixed(2)}
        </Text>
      </View>

      {/* Delivery charge */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-600 dark:text-neutral-300">
          Delivery Charge
        </Text>
        <Text className="text-gray-800 dark:text-white font-medium">
          ₹ {deliveryCharge.toFixed(2)}
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 dark:bg-neutral-700 mb-3" />

      {/* Grand total */}
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          Grand Total
        </Text>

        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-primary">
            ₹ {grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderBillFooter;
