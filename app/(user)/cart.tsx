import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { Tables } from "@/assets/data/types";
import CartListItem from "@/components/CartListItems";
import EmptyState from "@/components/EmptyState";
import GradientHeader from "@/components/GradientHeader";
import LocationModal from "@/components/Location/LocationModal";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";
import { formatPhone } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { useLocationContext } from "@/providers/LocationProvider";

export default function CartScreen() {
  const router = useRouter();
  const { items, total, checkout, isCheckingOut } = useCart();
  const { selectedAddress } = useLocationContext();

  const [locationModalVisible, setLocationModalVisible] = useState(false);

  /* AUTO OPEN LOCATION MODAL IF NONE SELECTED */
  useEffect(() => {
    if (!selectedAddress) setLocationModalVisible(true);
  }, [selectedAddress]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const deliveryCharge = 0;

  const canCheckout =
    !!selectedAddress?.area && !!selectedAddress?.name && !isCheckingOut;

  const handleCheckout = () => {
    if (!selectedAddress) {
      setLocationModalVisible(true);
      return;
    }
    checkout(selectedAddress as Tables<"addresses">);
  };

  if (!items.length) {
    return (
      <View className="flex-1 bg-background">
        <GradientHeader title="Cart" />

        {/* Empty content fills remaining space */}
        <View className="flex-1">
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            description="Looks like you haven’t added anything yet"
            actionLabel="Go to Menu"
            actionHref="/(user)/menu"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title="Cart" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{
          padding: 16,
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

      {/* STICKY BAR */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-background-subtle pt-2 pb-24 px-6">
        <View className="mb-3 bg-background-muted p-4 rounded-xl">
          <View className="flex-row justify-between">
            <Text className="text-text-secondary">Deliver to</Text>
            <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
              <Text className="text-primary font-semibold">Change</Text>
            </TouchableOpacity>
          </View>

          {selectedAddress?.area ? (
            <>
              <Text className="text-text-primary font-semibold mt-1">
                {selectedAddress.name}
              </Text>
              <Text className="text-text-secondary">
                {selectedAddress.area}
              </Text>
              <Text className="text-text-secondary">
                Phone: {formatPhone(selectedAddress.phone)}
              </Text>
            </>
          ) : (
            <Text className="text-text-secondary mt-2">
              Please select delivery address
            </Text>
          )}
        </View>

        <TouchableOpacity
          disabled={!canCheckout}
          onPress={() => {
            if (!canCheckout) return; // 🛡️ extra safety
            handleCheckout();
          }}
          activeOpacity={0.9}
          className={`rounded-full py-5 flex-row items-center justify-center ${
            canCheckout ? "bg-primary" : "bg-surface-elevated"
          }`}
        >
          <Ionicons
            name="cart"
            size={22}
            color={canCheckout ? "#ffffff" : "#9ca3af"}
          />

          <Text
            className={`ml-2 font-bold text-lg ${
              canCheckout ? "text-text-inverse" : "text-text-tertiary"
            }`}
          >
            {isCheckingOut ? "Placing order..." : "Checkout"}
          </Text>
        </TouchableOpacity>
      </View>

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />

      <StatusBar style="auto" />
    </View>
  );
}
