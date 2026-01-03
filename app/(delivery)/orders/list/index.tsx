import { useAdminOrderList } from "@/api/orders";
import { useInsertOrderSubscription } from "@/api/orders/subscription";
import OrderListItem from "@/components/OrderListItem";
import { Stack } from "expo-router";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function OrdersScreen() {
  const {
    data: orders,
    error,
    isLoading,
  } = useAdminOrderList({ archived: false });

  useInsertOrderSubscription();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>{error.message}</Text>;
  }
  return (
    <>
      <Stack.Screen options={{ title: "Active" }} />
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 32,
          gap: 16,
          paddingBottom: 100,
        }}
      />
    </>
  );
}
