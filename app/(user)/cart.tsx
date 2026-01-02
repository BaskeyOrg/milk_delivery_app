import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Tables } from "@/assets/data/types";
import CartListItem from "@/components/CartListItems";
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

  const handleCheckout = () => {
    if (!selectedAddress) {
      setLocationModalVisible(true);
      return;
    }
    checkout(selectedAddress as Tables<"addresses">);
  };

  if (!items.length) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
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
      <View className="absolute bottom-0 left-0 right-0 border-t bg-background pt-4 pb-28 px-6">
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
              <Text className="text-text-secondary">{selectedAddress.area}</Text>
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
          disabled={!selectedAddress?.area || isCheckingOut}
          onPress={handleCheckout}
          activeOpacity={0.9}
          className={`rounded-full py-5 flex-row items-center justify-center ${
            selectedAddress?.area && !isCheckingOut
              ? "bg-primary"
              : "bg-surface-elevated"
          }`}
        >
          <Ionicons
            name="cart"
            size={22}
            color={
              selectedAddress?.area && !isCheckingOut ? "#ffffff" : "#9ca3af"
            }
          />
          <Text
            className={`ml-2 font-bold text-lg ${
              selectedAddress?.area && !isCheckingOut
                ? "text-text-inverse"
                : "text-text-tertiary"
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
