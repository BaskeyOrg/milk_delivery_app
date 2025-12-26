import { Tables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect, useSegments } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

export default function ProductListItem({ product }: ProductListItemProps) {
  const segments = useSegments();
  const { addItem } = useCart();
  const { session } = useAuth();

  const userId = session?.user.id;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistRowId, setWishlistRowId] = useState<number | null>(null);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const checkWishlist = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", product.id)
      .maybeSingle(); // 👈 IMPORTANT

    if (data) {
      setIsWishlisted(true);
      setWishlistRowId(data.id);
    } else {
      setIsWishlisted(false);
      setWishlistRowId(null);
    }
  };

  /* ✅ RE-CHECK WHEN SCREEN COMES BACK INTO FOCUS */
  useFocusEffect(
    useCallback(() => {
      checkWishlist();
    }, [userId, product.id])
  );


  const toggleWishlist = async () => {
    if (!userId || loadingWishlist) return;

    setLoadingWishlist(true);

    if (isWishlisted && wishlistRowId) {
      await supabase.from("wishlist").delete().eq("id", wishlistRowId);
      setIsWishlisted(false);
      setWishlistRowId(null);
    } else {
      const { data } = await supabase
        .from("wishlist")
        .insert({
          user_id: userId,
          product_id: product.id,
        })
        .select("id")
        .single();

      if (data) {
        setIsWishlisted(true);
        setWishlistRowId(data.id);
      }
    }

    setLoadingWishlist(false);
  };


  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable
        className="bg-white rounded-3xl overflow-hidden mb-3 m-1"
        style={{ width: "48%" }}
      >
        <View className="relative">
          <RemoteImage
            path={product.image ?? undefined}
            fallback={defaultPizzaImage}
            resizeMode="cover"
            className="w-full h-44 bg-background-lighter"
          />

          {/* ❤️ WISHLIST BUTTON */}
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 p-2 rounded-full"
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
          >
            {loadingWishlist ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={isWishlisted ? "heart" : "heart-outline"}
                size={18}
                color={isWishlisted ? "#EF4444" : "#fff"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="p-3">
          <Text
            className="text-primary font-bold text-sm mb-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-lg">
              ₹ {product.price}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
