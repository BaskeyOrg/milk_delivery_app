import { useMyOrderList } from "@/api/orders";
import OrderListItem from "@/components/OrderListItem";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">
          Loading orders...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load orders
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please try again later
        </Text>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="receipt-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          No orders yet
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Your order history will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <OrderListItem order={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 32,
        gap: 16,
        paddingBottom: 100,
      }}
    />
  );
}
