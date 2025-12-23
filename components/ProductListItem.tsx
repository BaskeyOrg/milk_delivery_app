import { Tables } from "@/assets/data/types";
import { useCart } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { Link, useSegments } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

export default function ProductListItem({ product }: ProductListItemProps) {
  const segments = useSegments();
  const { addItem } = useCart();

  // NOTE: original project has sizes for cart items (PizzaSize). We pick a reasonable default size 'M'.
  const handleAddToCart = () => addItem(product, 'M');

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable className="bg-white rounded-3xl overflow-hidden mb-3 m-1" style={{ width: '48%' }}>
        <View className="relative">
          <RemoteImage
            path={product?.image ?? undefined}
            fallback={defaultPizzaImage}
            resizeMode="cover"
            className="w-full h-44 bg-background-lighter"
          />

          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 p-2 rounded-full"
            activeOpacity={0.8}
            onPress={() => console.log('toggle wishlist - implement hook')}
          >
            <Ionicons name="heart-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="p-3">
          {/* category not available in current schema; omit or show placeholder */}
          <Text className="text-primary font-bold text-sm mb-2" numberOfLines={2}>{product.name}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-lg">₹ {product.price}</Text>

            <TouchableOpacity
              className="bg-primary rounded-full w-8 h-8 items-center justify-center"
              activeOpacity={0.8}
              onPress={handleAddToCart}
            >
              <Ionicons name="add" size={18} color="#121212" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
