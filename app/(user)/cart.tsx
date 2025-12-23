import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, FlatList, Platform, Text, View } from "react-native";

import Button from "@/components/Button";
import CartListItem from "@/components/CartListItems";
import OrderBillFooter from "@/components/OrderBillFooter";

import { Tables } from "@/assets/data/types";
import AddressSelectionModal from "@/components/Address/AddressSelectionModal";
import { useAddresses } from "@/hooks/useAddresses";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  const { session } = useAuth();
  const { addresses, reload } = useAddresses(session?.user.id ?? '');

  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  /** STEP 1: Checkout click */
  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No address found",
        "Please add an address before checkout",
        [
          {
            text: "Go to Profile",
            onPress: () => router.push("/(user)/profile"),
          },
        ]
      );
      return;
    }

    setAddressModalVisible(true);
  };

  /** STEP 2: Address selected */
  const handleAddressProceed = (address: Tables<'addresses'>) => {
    setAddressModalVisible(false);

    // You can store selected address in context or pass to checkout
    checkout(address); // ← optional: pass address
  };

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

      {/* Checkout */}
      <Button onPress={handleCheckout} text="Checkout" />

      {/* Address Modal */}
      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleAddressProceed}
      />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default CartScreen;
