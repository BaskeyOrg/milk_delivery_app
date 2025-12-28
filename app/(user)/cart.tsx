import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import GradientHeader from "@/components/GradientHeader";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

export default function CartScreen() {
  const router = useRouter();
  const { items, total, checkout } = useCart();
  const { session } = useAuth();
  const { data: addresses = [] } = useAddressList(session?.user.id ?? "");

  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const deliveryCharge = 0;

  /* ---------------- CHECKOUT ---------------- */

  const handleCheckout = () => {
    if (!items.length) return;

    if (!addresses.length) {
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

  const handleAddressProceed = (address: Tables<"addresses">) => {
    setAddressModalVisible(false);
    checkout(address);
  };

  /* ---------------- EMPTY CART ---------------- */

  if (!items.length) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-background">
        <Ionicons name="cart-outline" size={80} color="#9CA3AF" />

        <Text className="text-text-primary font-semibold text-xl mt-4">
          Your cart is empty
        </Text>

        <Text className="text-text-secondary text-center mt-2">
          Looks like you haven’t added anything yet
        </Text>

        <View className="mt-6">
          <TouchableOpacity
            onPress={() => router.push("/(user)/menu")}
            className="rounded-full px-8 py-4 flex-row items-center bg-primary"
            activeOpacity={0.85}
          >
            <Ionicons name="apps" size={22} color="#121212" />
            <Text className="font-bold text-lg ml-2 text-background">
              Go to Menu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <View className="flex-1 bg-background">
      {/* OVERLAY HEADER */}
      <GradientHeader title="Cart" />

      {/* CART ITEMS */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 10,
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

      {/* STICKY CHECKOUT BAR */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-background-subtle bg-background pt-4 pb-28 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#43ce4e" />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>

          <Text className="text-text-primary font-bold text-xl">
            ₹ {total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCheckout}
          activeOpacity={0.9}
          className="bg-primary rounded-full"
        >
          <View className="py-5 flex-row items-center justify-center">
            <Text className="text-background font-bold text-lg mr-2">
              Checkout
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#121212" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ADDRESS MODAL */}
      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleAddressProceed}
      />


      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </View>
  );
}
