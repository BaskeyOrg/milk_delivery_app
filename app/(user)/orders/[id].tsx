import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import GradientHeader from "@/components/GradientHeader";
import OrderItemList from "@/components/OrderItemListItem";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function OrderDetailsScreen() {
  const { id: idParam } = useLocalSearchParams();

  const id = Array.isArray(idParam)
    ? Number(idParam[0])
    : Number(idParam);

  if (!id || isNaN(id)) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-accent-error text-lg">
          Invalid Order ID
        </Text>
      </View>
    );
  }

  const deliveryCharge = 0;

  const {
    data: order,
    isLoading,
    error,
  } = useOrderDetails(id);

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
        <Text className="text-accent-error text-lg">
          Failed to fetch order ID ---
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title={`Order #${order.id}`} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
          gap: 16,
          paddingHorizontal: 16,
        }}
      >
        {order.addresses && (
          <OrderAddressCard address={order.addresses} />
        )}

        <OrderItemList items={order.order_items ?? []} />

        <OrderSummeryFooter
          itemsTotal={order.total}
          deliveryCharge={deliveryCharge}
        />
      </ScrollView>
    </View>
  );
}
