import React from "react";
import { Text, View } from "react-native";

type OrderBillFooterProps = {
  itemsTotal: number;
  deliveryCharge?: number;
};

const OrderSummeryFooter = ({
  itemsTotal,
  deliveryCharge = 0,
}: OrderBillFooterProps) => {
  const grandTotal = itemsTotal + deliveryCharge;

  return (
    <View className="bg-background-card
    rounded-3xl p-5
    bg-black/5">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        {/* <Ionicons name="receipt-outline" size={20} color="#4F46E5" /> */}
        <Text className="text-text-primary text-xl font-bold">
          Summary
        </Text>
      </View>

      <View className="space-y-3">
        {/* Items total */}
        <View className="flex-row justify-between items-center">
          <Text className="text-text-secondary text-base">Items Total</Text>
          <Text className="text-text-primary font-bold text-base">
            ₹ {itemsTotal.toFixed(2)}
          </Text>
        </View>

        {/* Delivery */}
        <View className="flex-row justify-between items-center">
          <Text className="text-text-secondary text-base">Delivery</Text>
          <Text className="text-text-primary font-bold text-base">
            ₹ {deliveryCharge.toFixed(2)}
          </Text>
        </View>

        {/* Divider */}
        {/* <View className="border-t border-background-lighter  my-3" /> */}

        {/* Grand total */}
        <View className="flex-row justify-between items-center mt-3">
          <Text className="text-text-primary font-bold text-lg">Total</Text>
          <Text className="text-primary font-bold text-2xl">
            ₹ {grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderSummeryFooter;
