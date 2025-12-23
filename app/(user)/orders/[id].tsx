import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderBillFooter from "@/components/OrderBillFooter";
import OrderItemListItem from "@/components/OrderItemListItem";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

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
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

    {/* Order Items */}
      <FlatList
        data={order.order_items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={<OrderBillFooter itemsTotal={order.total} />}
        ListFooterComponent={() => (
          <OrderBillFooter
            itemsTotal={order.total}
            deliveryCharge={deliveryCharge}
          />
        )}
      />
    </View>
  );
}
