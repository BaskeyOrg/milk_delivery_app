import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import { OrderStatusList, statusColors } from "@/assets/data/types";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import OrderItemListDelivery from "@/components/OrderItemListDelivery";
import OrderBillFooter from "@/components/OrderSummeryFooter";
import { notifyUserAboutOrderUpdate } from "@/lib/notifications";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function AdminOrderDetailScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = Number(typeof idString === "string" ? idString : idString?.[0]);
  const deliveryCharge = 0;

  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateOrderStatus = async (status: string) => {
    updateOrder({
      id,
      updatedFields: { status },
    });

    if (order) {
      await notifyUserAboutOrderUpdate({ ...order, status });
    }
  };
  /* 📞 Call customer (ADMIN ACTION) */
  const callCustomer = () => {
    if (!order?.addresses?.phone) return;
    Linking.openURL(`tel:${order.addresses.phone}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-red-500 text-lg">Failed to load order</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140, gap: 16 }}
        className="p-4"
      >
        {/* ✅ Delivery Address (shared component) */}
        {order.addresses && <OrderAddressCard address={order.addresses} />}
        {/* 📞 Call Customer (ADMIN ONLY) */}
        {order.addresses?.phone && (
          <Pressable
            onPress={callCustomer}
            className="flex-row items-center bg-surface rounded-2xl p-4"
          >
            {/* Icon */}
            <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Ionicons name="call" size={24} color="#1DB954" />
            </View>

            {/* Text */}
            <View>
              <Text className="text-text-primary font-bold text-base">
                Call Customer
              </Text>
              <Text className="text-text-secondary text-sm">
                {order.addresses.phone}
              </Text>
            </View>
          </Pressable>
        )}

        {/* 📍 View on Map */}
        {order.addresses?.latitude && order.addresses?.longitude && (
          <View className="bg-surface rounded-2xl overflow-hidden">
            <Pressable
              onPress={() => {
                const { latitude, longitude } = order.addresses!;
                const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                Linking.openURL(url);
              }}
              className="flex-row items-center p-4"
            >
              {/* Icon */}
              <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-3">
                <Ionicons name="map" size={24} color="#1DB954" />
              </View>

              {/* Text */}
              <View className="flex-1">
                <Text className="text-text-primary font-bold text-base">
                  View on Map
                </Text>
                <Text className="text-text-secondary text-sm">
                  Open delivery location in Google Maps
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        )}

        {/* ✅ Order Items (shared component) */}
        <OrderItemListDelivery items={order.order_items ?? []} />

        {/* ✅ Admin Status Controls */}
        <View className="bg-surface rounded-2xl p-4 space-y-3">
          <Text className="text-lg font-bold text-text-primary">
            Order Status
          </Text>

          <View className="flex-row flex-wrap gap-2 mt-2">
            {OrderStatusList.map((status) => {
              const isActive = order.status === status;
              const colorClass = statusColors[status];

              return (
                <Pressable
                  key={status}
                  onPress={() => updateOrderStatus(status)}
                  className={`
                  px-4 py-2 rounded-xl border
                  ${isActive ? colorClass : "border-gray-300 bg-transparent"}
                `}
                >
                  <Text
                    className={`
                    font-semibold capitalize
                    ${isActive ? "text-white" : "text-gray-700"}
                  `}
                  >
                    {status}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ✅ Order Summary Footer (shared component) */}
        <OrderBillFooter
          itemsTotal={order.total}
          deliveryCharge={deliveryCharge}
        />
      </ScrollView>
    </View>
  );
}
