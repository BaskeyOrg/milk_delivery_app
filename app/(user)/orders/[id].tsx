import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import GradientHeader from "@/components/GradientHeader";
import OrderItemList from "@/components/OrderItemListItem";
import OrderBillFooter from "@/components/OrderSummeryFooter";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function OrderDetailsScreen() {
  /* ---------------- PARAMS ---------------- */
  const { id: idParam } = useLocalSearchParams();

  const id = Number(
    typeof idParam === "string" ? idParam : idParam?.[0]
  );

  const deliveryCharge = 20;

  /* ---------------- DATA ---------------- */
  const { data: order, isLoading, error } = useOrderDetails(id);

  // 🔴 Real-time updates (Supabase channel / websocket)
  useUpdateOrderSubscription(id);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#43ce4e" />
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-accent-error text-lg">
          Failed to fetch order
        </Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <View className="flex-1 bg-background">
      <GradientHeader title={`Order #${order.id}`} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 140,
          gap: 16,
          paddingHorizontal: 16,
        }}
      >
        {/* 📍 Delivery Address */}
        {order.addresses && (
          <OrderAddressCard address={order.addresses} />
        )}

        {/* 🍕 Order Items */}
        <OrderItemList items={order.order_items ?? []} />

        {/* 💰 Bill Summary */}
        <OrderBillFooter
          itemsTotal={order.total}
          deliveryCharge={deliveryCharge}
        />
      </ScrollView>
    </View>
  );
}
