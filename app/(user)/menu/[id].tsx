import { useProduct } from "@/api/products";
import { PizzaSize } from "@/assets/data/types";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import { useCart } from "@/providers/CartProvider";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(typeof isString === "string" ? isString : isString?.[0]);
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push("/(user)/cart");
  };

  if (isLoading) return <ActivityIndicator className="mt-10" />;
  if (error) return <Text className="text-red-500">{error.message}</Text>;
  if (!product) return <Text className="text-center mt-10">Product not found</Text>;

  return (
    <View className="flex-1 bg-white px-4 py-4">
      <Stack.Screen options={{ title: product?.name, headerShown: true }} />

      <RemoteImage
        path={product?.image ?? undefined}
        fallback={defaultPizzaImage}
        resizeMode="contain"
        className="w-full aspect-square mb-4 rounded-lg"
      />

      <Text className="text-gray-700 font-semibold mb-2">Select size</Text>
      <View className="flex-row justify-between mb-4">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <Pressable
              key={size}
              onPress={() => setSelectedSize(size)}
              className={`w-12 aspect-square rounded-full items-center justify-center ${
                isSelected ? "bg-gray-300" : "bg-gray-50"
              }`}
            >
              <Text className={`text-lg font-medium ${isSelected ? "text-black" : "text-gray-500"}`}>
                {size}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="text-lg font-bold mb-4">Price: ₹ {product.price}</Text>

      <Button text="Add to cart" onPress={addToCart} />
    </View>
  );
}
