import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, Text, View } from "react-native";

import Button from "@/components/Button";
import CartListItem from "@/components/CartListItems";
import OrderBillFooter from "@/components/OrderBillFooter";
import { useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-2xl font-bold text-gray-700 mb-4">
          Your cart is empty
        </Text>
        <Button text="Go to Menu" onPress={() => router.push("/(user)/menu")} />
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900 p-4">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ gap: 10 }}
      />

      <OrderBillFooter itemsTotal={total} deliveryCharge={0} />

      <Button onPress={checkout} text="Checkout" />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default CartScreen;
