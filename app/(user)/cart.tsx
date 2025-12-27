import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddressSelectionModal from "@/components/Address/AddressSelectionModal";
import CartListItem from "@/components/CartListItems";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";

import { useAddressList } from "@/api/addresses";
import { Tables } from "@/assets/data/types";
import OverlayHeader from "@/components/OverlayHeader";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  const { session } = useAuth();
  const { data: addresses = [] } = useAddressList(session?.user.id ?? "");

  const [addressModalVisible, setAddressModalVisible] = useState(false);

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
      Alert.alert("No address found", "Please add an address before checkout", [
        {
          text: "Go to Profile",
          onPress: () => router.push("/(user)/profile"),
        },
      ]);
      return;
    }

    setAddressModalVisible(true);
  };

  /** STEP 2: Address selected */
  const handleAddressProceed = (address: Tables<"addresses">) => {
    setAddressModalVisible(false);
    checkout(address);
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 ">
        <Ionicons name="cart-outline" size={80} color="#666" />

        <Text className="text-text-primary font-semibold text-xl mt-4">
          Your cart is empty
        </Text>

        <Text className="text-text-secondary text-center mt-2">
          Looks like you haven’t added anything yet
        </Text>

        <View className="mt-6 ">
          <TouchableOpacity
            className={`rounded-full px-8 py-4 flex-row justify-center bg-primary`}
            activeOpacity={0.8}
            onPress={() => router.push("/(user)/menu")}
          >
            <Ionicons name="apps" size={24} color="#121212" />
            <Text className={`font-bold text-lg ml-2 `}>Go to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <OverlayHeader title="Cart" />
      {/* Cart List + Summary */}
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 100,
          paddingBottom: 340,
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
        >
          <View className="py-5 flex-row items-center justify-center">
            <Text className="text-background font-bold text-lg mr-2">
              Checkout
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#121212" />
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
