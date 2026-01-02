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

import CartListItem from "@/components/CartListItems";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";

import { useAddressList } from "@/api/addresses";
import { Tables } from "@/assets/data/types";
import GradientHeader from "@/components/GradientHeader";
import LocationModal from "@/components/Location/LocationModal";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { useLocationContext } from "@/providers/LocationProvider";

export default function CartScreen() {
  const router = useRouter();
  const { items, total, checkout } = useCart();
  const { session } = useAuth();
  const { data: addresses = [] } = useAddressList(session?.user.id ?? "");

  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const { selectedAddress } = useLocationContext();

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const deliveryCharge = 0;

  /* ---------------- CHECKOUT ---------------- */

  const handleCheckout = () => {
    if (!items.length) return;

    if (!addresses.length) {
      Alert.alert("No address found", "Please add an address before checkout", [
        {
          text: "Go to Profile",
          onPress: () => router.push("/(user)/profile"),
        },
      ]);
      return;
    }

    alert("Proceeding to checkout");

    // setAddressModalVisible(true);
  };

  const handleAddressProceed = (address: Tables<"addresses">) => {
    // setAddressModalVisible(false);
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
        <View className="mb-3 bg-background-muted p-4 rounded-xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-sm">Deliver to</Text>

            <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
              <Text className="text-primary font-semibold text-sm">Change</Text>
            </TouchableOpacity>
          </View>

          

          <Text
            numberOfLines={2}
            className="text-text-primary font-semibold text-base mt-1"
          >
            {selectedAddress ?? "Select delivery address"}
          </Text>
        </View>

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
          disabled={!selectedAddress}
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
      {/* <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleAddressProceed}
      /> */}

            {/* 📍 Location selection modal */}
            <LocationModal
              visible={locationModalVisible}
              onClose={() => {
                setLocationModalVisible(false);
              }}
            />

      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </View>
  );
}
