import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import GradientHeader from "@/components/GradientHeader";
import OrderItemList from "@/components/OrderItemListItem";
import OrderSubscriptionDetailsCard from "@/components/subscription/OrderSubscriptionDetailsCard";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";
import PauseVacationModal from "@/components/subscription/PauseVacationModal";
import SkipDayModal from "@/components/subscription/SkipDayModal";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailsScreen() {
  const { id: idParam } = useLocalSearchParams();
  const [pauseOpen, setPauseOpen] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);

  const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);

  if (!id || isNaN(id)) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-accent-error text-lg">Invalid Order ID</Text>
      </View>
    );
  }

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
      <GradientHeader title={`Order #${order.id}`} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
          gap: 16,
          paddingHorizontal: 16,
        }}
      >
        {order.addresses && <OrderAddressCard address={order.addresses} />}

        {/* ✅ SUBSCRIPTION DETAILS */}
        {order.subscription && (
          <>
            <OrderSubscriptionDetailsCard subscription={order.subscription} />

            <View className="gap-3">
              <TouchableOpacity
                onPress={() => setPauseOpen(true)}
                className="bg-yellow-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Pause Subscription
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSkipOpen(true)}
                className="bg-red-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Skip Subscription
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <OrderItemList items={order.order_items ?? []} />

        <OrderSummeryFooter itemsTotal={order.total} deliveryCharge={0} />
      </ScrollView>
      <PauseVacationModal
        visible={pauseOpen}
        onClose={() => setPauseOpen(false)}
        subscriptionId={order?.subscription?.id}
      />

      <SkipDayModal
        visible={skipOpen}
        onClose={() => setSkipOpen(false)}
        subscriptionId={order?.subscription?.id}
      />
    </View>
  );
}
