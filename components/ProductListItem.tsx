import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistStatus,
} from "@/api/wishlist";
import { ProductVariant, Tables } from "@/assets/data/types";
import { useAuth } from "@/providers/AuthProvider";

import { Ionicons } from "@expo/vector-icons";
import { Link, useSegments } from "expo-router";
import React from "react";
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
  product: Tables<"products"> & { variants: ProductVariant[] };
};

export default function ProductListItem({ product }: ProductListItemProps) {
  const segments = useSegments();
  const { session } = useAuth();
  const userId = session?.user.id;

  const { data, isLoading } = useWishlistStatus(userId, product.id);
  const addToWishlist = useAddToWishlist(userId);
  const removeFromWishlist = useRemoveFromWishlist(userId);

  const toggleWishlist = () => {
    if (!userId || isLoading) return;

    if (data?.isWishlisted && data.wishlistRowId) {
      removeFromWishlist.mutate(data.wishlistRowId);
    } else {
      addToWishlist.mutate(product.id);
    }
  };

  // Safely get base price from product or first variant
  const displayPrice =
    product.variants?.[0]?.price ?? 0;

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable
        className="rounded-3xl overflow-hidden mb-3 m-1 bg-black/5"
        style={{ width: "48%" }}
      >
        <View className="relative">
          <RemoteImage
            path={product.image ?? undefined}
            fallback={defaultPizzaImage}
            resizeMode="cover"
            className="w-full h-44 bg-background-lighter"
          />

          {/* ❤️ WISHLIST */}
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 p-2 rounded-full"
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
          >
            {isLoading ||
            addToWishlist.isPending ||
            removeFromWishlist.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={data?.isWishlisted ? "heart" : "heart-outline"}
                size={18}
                color={data?.isWishlisted ? "#EF4444" : "#fff"}
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

          <Text className="text-primary font-bold text-lg">
            ₹ {displayPrice.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
