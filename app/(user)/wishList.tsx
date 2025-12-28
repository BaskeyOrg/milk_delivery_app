import { useRemoveFromWishlist, useWishlist } from "@/api/wishlist";
import { Tables } from "@/assets/data/types";
import GradientHeader from "@/components/GradientHeader";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------------- SCREEN ---------------- */

export default function WishlistScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { addItem } = useCart();

  const userId = session?.user.id;

  const { data: wishlist = [], isLoading } = useWishlist(userId);
  const { mutate: removeItem, isPending } = useRemoveFromWishlist(userId);

  /* ---------------- ACTIONS ---------------- */

  const handleRemove = (id: number, name: string) => {
    Alert.alert("Remove item", `Remove ${name} from wishlist?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeItem(id),
      },
    ]);
  };

  const addToCart = (product: Tables<"products">) => {
    addItem(product, "M", 1);
    router.push("/(user)/cart");
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return <ActivityIndicator className="mt-10" />;
  }

  /* ---------------- UI ---------------- */

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title="Wishlist" />

      {wishlist.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 120,
            gap: 16,
          }}
        >
          <View className="px-6 space-y-4">
            {wishlist.map((item) => (
              <View
                key={item.id}
                className="bg-background-subtle rounded-3xl p-4 mb-4"
              >
                {/* PRODUCT */}
                <View className="flex-row">
                  <RemoteImage
                    path={item.products.image ?? undefined}
                    fallback={defaultPizzaImage}
                    className="w-24 h-24 rounded-xl bg-surface-elevated"
                  />

                  <View className="flex-1 ml-4">
                    <Text
                      className="text-text-primary font-bold text-base"
                      numberOfLines={2}
                    >
                      {item.products.name}
                    </Text>

                    <Text className="text-primary font-bold text-lg mt-1">
                      ₹ {item.products.price}
                    </Text>

                    <Text className="text-text-secondary text-sm mt-1">
                      Size: M
                    </Text>
                  </View>

                  {/* REMOVE */}
                  <TouchableOpacity
                    onPress={() => handleRemove(item.id, item.products.name)}
                    disabled={isPending}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {/* ADD TO CART */}
                <TouchableOpacity
                  onPress={() => addToCart(item.products)}
                  activeOpacity={0.85}
                  className="mt-4 rounded-full py-4 flex-row items-center justify-center bg-primary"
                >
                  <Ionicons name="cart" size={22} color="#121212" />
                  <Text className="ml-2 font-bold text-base text-inverse">
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

/* ---------------- EMPTY STATE ---------------- */

function EmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="heart-outline" size={80} color="#9CA3AF" />

      <Text className="text-text-primary font-semibold text-xl mt-4">
        Your wishlist is empty
      </Text>

      <Text className="text-text-secondary text-center mt-2">
        Start adding products you love
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(user)/menu")}
        activeOpacity={0.85}
        className="mt-6 rounded-full px-8 py-4 flex-row items-center bg-primary"
      >
        <Ionicons name="apps" size={22} color="#121212" />
        <Text className="ml-2 font-bold text-base text-inverse">
          Go to Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
}
