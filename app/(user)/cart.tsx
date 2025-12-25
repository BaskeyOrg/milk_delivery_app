import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddressSelectionModal from "@/components/Address/AddressSelectionModal";
import Button from "@/components/Button";
import CartListItem from "@/components/CartListItems";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";

import { Tables } from "@/assets/data/types";
import { useAddresses } from "@/hooks/useAddresses";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  const { session } = useAuth();
  const { addresses } = useAddresses(session?.user.id ?? "");

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const deliveryCharge = 0;

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
  const handleAddressProceed = (address: Tables<"addresses">) => {
    setAddressModalVisible(false);
    setPaymentLoading(true);
    checkout(address);
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-2xl font-bold text-text-primary mb-4">
          Your cart is empty
        </Text>
        <Button
          text="Go to Menu"
          onPress={() => router.push("/(user)/menu")}
        />
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Cart List + Summary */}
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 340, // 👈 space for summary + sticky bar
          gap: 12,
        }}
        ListFooterComponent={
          <OrderSummeryFooter
            itemsTotal={total}
            deliveryCharge={deliveryCharge}
          />
        }
      />

      {/* Sticky Checkout Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface pt-4 pb-32 px-6">
        {/* Quick Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>

          <Text className="text-text-primary font-bold text-xl">
            ₹ {total.toFixed(2)}
          </Text>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          className="bg-primary rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="py-5 flex-row items-center justify-center">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text className="text-background font-bold text-lg mr-2">
                  Checkout
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

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
