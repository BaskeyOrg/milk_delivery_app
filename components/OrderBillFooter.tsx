import React from 'react';
import { Text, View } from 'react-native';

type OrderBillFooterProps = {
  itemsTotal: number;
  deliveryCharge?: number;
};

const OrderBillFooter = ({ itemsTotal, deliveryCharge = 0 }: OrderBillFooterProps) => {
  const grandTotal = itemsTotal + deliveryCharge;

  return (
    <View className="mt-4 p-4 bg-gray-100 rounded-lg space-y-2">
      <Text className="text-lg font-bold mb-2">Bill Details</Text>

      <View className="flex-row justify-between">
        <Text className="text-gray-700">Items Total</Text>
        <Text className="text-gray-700">Rs. {itemsTotal.toFixed(2)}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-700">Delivery Charge</Text>
        <Text className="text-gray-700">Rs. {deliveryCharge.toFixed(2)}</Text>
      </View>

      <View className="border-t border-gray-400 mt-2 pt-2 flex-row justify-between">
        <Text className="text-lg font-bold">Grand Total</Text>
        <Text className="text-lg font-bold text-green-600">Rs. {grandTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default OrderBillFooter;
