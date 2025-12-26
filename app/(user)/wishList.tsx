import { Tables } from "@/assets/data/types";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import SafeScreen from "@/components/SafeScreen";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/* ---------------- TYPES ---------------- */

type WishlistItem = Tables<"wishlist"> & {
  products: Tables<"products">;
};

/* ---------------- SCREEN ---------------- */

export default function WishlistScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { addItem } = useCart();

  const userId = session?.user.id;

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  /* ---------------- FETCH WISHLIST ---------------- */

  const fetchWishlist = async () => {
    if (!userId) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("wishlist")
      .select(
        `
        id,
        product_id,
        user_id,
        created_at,
        products (
          id,
          name,
          price,
          image
        )
      `
      )
      .eq("user_id", userId);

    if (!error && data) {
      setWishlist(data as WishlistItem[]);
    }

    setIsLoading(false);
  };

  /* ✅ REFETCH WHEN SCREEN IS FOCUSED */
  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [userId])
  );

  /* ---------------- ACTIONS ---------------- */

  const removeFromWishlist = (item: WishlistItem) => {
    Alert.alert(
      "Remove from wishlist",
      `Remove ${item.products.name} from wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemovingId(item.id);

            const { error } = await supabase
              .from("wishlist")
              .delete()
              .eq("id", item.id);

            setRemovingId(null);

            if (!error) {
              setWishlist((prev) => prev.filter((w) => w.id !== item.id));
            }
          },
        },
      ]
    );
  };

  const addToCartFromWishlist = (product: Tables<"products">) => {
    addItem(product, "M", 1);
    router.push("/(user)/cart");
  };

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return (
      <SafeScreen>
        <ActivityIndicator className="mt-10" />
      </SafeScreen>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-6 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>

        <Text className="text-text-secondary text-sm ml-auto">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="p-6 gap-4">
            {wishlist.map((item) => (
              <View key={item.id} className="bg-surface rounded-3xl p-4">
                {/* PRODUCT INFO */}
                <View className="flex-row">
                  <RemoteImage
                    path={item.products.image ?? undefined}
                    fallback={defaultPizzaImage}
                    className="w-24 aspect-square rounded-lg"
                  />

                  <View className="flex-1 ml-4">
                    <Text
                      className="text-text-primary font-bold text-lg"
                      numberOfLines={2}
                    >
                      {item.products.name}
                    </Text>

                    <Text className="text-primary text-xl font-bold mt-1">
                      ₹ {item.products.price}
                    </Text>

                    <Text className="text-text-secondary text-sm mt-1">
                      Size: M
                    </Text>
                  </View>

                  {/* REMOVE */}
                  <TouchableOpacity
                    onPress={() => removeFromWishlist(item)}
                    disabled={removingId === item.id}
                    className="p-2"
                  >
                    {removingId === item.id ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="#EF4444"
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* ADD TO CART */}
                <TouchableOpacity
                  className="rounded-2xl px-8 py-4 mt-4 flex-row items-center justify-center bg-primary"
                  activeOpacity={0.8}
                  onPress={() => addToCartFromWishlist(item.products)}
                >
                  <Ionicons name="cart" size={24} color="#121212" />
                  <Text className="font-bold text-lg text-background ml-2">
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}

/* ---------------- EMPTY STATE ---------------- */

function EmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Ionicons name="heart-outline" size={80} color="#666" />
      <Text className="text-text-primary font-semibold text-xl mt-4">
        Your wishlist is empty
      </Text>
      <Text className="text-text-secondary text-center mt-2">
        Start adding products you love!
      </Text>

      <TouchableOpacity
        className={`rounded-full px-8 py-4 mt-6 flex-row justify-center bg-primary`}
        activeOpacity={0.8}
        onPress={() => router.push("/(user)/menu")}
      >
        <Ionicons name="apps" size={24} color="#121212" />
        <Text className={`font-bold text-lg ml-2 `}>Go to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
