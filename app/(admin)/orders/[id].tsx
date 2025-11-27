import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import { OrderStatusList } from "@/assets/data/types";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { notifyUserAboutOrderUpdate } from "@/lib/notifications";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const OrderDetailScreen = () => {
  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(
    typeof isString === "string" ? isString : isString?.[0]
  );

  const { data: order, error, isLoading } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateOrderStatus = async (status: string) => {
    updateOrder({
      id,
      updatedFields: {
        status,
      },
    });

    if (order) {
      await notifyUserAboutOrderUpdate({ ...order, status });
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error || !order) {
    return <Text>Failed to load order</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order?.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateOrderStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order?.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});

export default OrderDetailScreen;
