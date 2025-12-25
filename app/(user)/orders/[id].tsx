import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import OrderItemList from "@/components/OrderItemListItem";
import OrderBillFooter from "@/components/OrderSummeryFooter";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = Number(typeof idString === "string" ? idString : idString[0]);
  const deliveryCharge = 20;

  const { data: order, isLoading, error } = useOrderDetails(id);
  useUpdateOrderSubscription(id);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Failed to fetch order</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-50 dark:bg-neutral-900">
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 20, gap: 16 }}>
        {/* Address Section */}
        {order.addresses && (
          <OrderAddressCard address={order.addresses} />
        )}

        {/* Single Card for All Products */}
        <OrderItemList items={order.order_items} />

        {/* Footer */}
        <OrderBillFooter itemsTotal={order.total} deliveryCharge={deliveryCharge} />
      </ScrollView>
    </View>
  );
}
