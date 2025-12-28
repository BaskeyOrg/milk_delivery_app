import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import GradientHeader from "@/components/GradientHeader";
import OrderItemList from "@/components/OrderItemListItem";
import OrderBillFooter from "@/components/OrderSummeryFooter";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = Number(typeof idString === "string" ? idString : idString[0]);
  const deliveryCharge = 20;

  const { data: order, isLoading, error } = useOrderDetails(id);
  useUpdateOrderSubscription(id);



  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#43ce4e" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-accent-error text-lg">Failed to fetch order</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title={order ? `Order #${order.id}` : "Order Details"} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140, gap: 16, paddingHorizontal: 16 }}>
        {order.addresses && <OrderAddressCard address={order.addresses} />}

        <OrderItemList items={order.order_items} />

        <OrderBillFooter
          itemsTotal={order.total}
          deliveryCharge={deliveryCharge}
        />
      </ScrollView>
    </View>
  );
}
