import { useMyOrderList } from "@/api/orders";
import EmptyState from "@/components/EmptyState";
import GradientHeader from "@/components/GradientHeader";
import OrderListItem from "@/components/OrderListItem";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#43ce4e" />
        <Text className="mt-3 text-text-secondary">
          Loading orders...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load orders Order-index
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please try again later
        </Text>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <GradientHeader title="Orders" />

        {/* Empty content fills remaining space */}
        <View className="flex-1">
          <EmptyState
            icon="receipt-outline"
            title="No orders yet"
            description="Your order history will appear here"
            actionLabel="Start Shopping"
            actionHref="/(user)/menu"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderListItem order={item} />
        )}
        contentContainerStyle={{ paddingBottom: 120, gap: 12 }}
        ListHeaderComponent={<GradientHeader title="Orders" />}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
}
