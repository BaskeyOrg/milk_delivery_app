import { useProduct } from "@/api/products";
import { PizzaSize } from "@/assets/data/types";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import SafeScreen from "@/components/SafeScreen";
import { useCart } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(
    typeof isString === "string" ? isString : isString?.[0]
  );
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize, quantity);
    // ✅ Reset state
    setQuantity(1);
    setSelectedSize("M");
    
    router.push("/(user)/cart");
  };

  if (isLoading) return <ActivityIndicator className="mt-10" />;
  if (error) return <Text className="text-red-500">{error.message}</Text>;
  if (!product)
    return <Text className="text-center mt-10">Product not found</Text>;

  const inStock = (product as any).stock ? (product as any).stock > 0 : true;

  return (
    <SafeScreen>
      <Stack.Screen options={{ title: product.name, headerShown: false }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="relative">
          <RemoteImage
            path={product?.image ?? undefined}
            fallback={defaultPizzaImage}
            resizeMode="cover"
            className="w-full h-96"
          />
        </View>

        <View className="p-6">
          <Text className="text-text-primary text-3xl font-bold mb-2">
            {product.name}
          </Text>
          {/* <Text className="text-primary mb-4">{(product as any).category ?? ''}</Text> */}

          <Text className="text-primary text-3xl font-bold mb-4">
            ₹ {product.price}
          </Text>
          <Text className="text-text-primary font-semibold mb-2">Select size</Text>
          <View className="flex-row justify-between mb-4">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`w-12 aspect-square rounded-full items-center justify-center ${
                    isSelected ? "bg-surface-light border border-primary" : "bg-surface"
                  }`}
                >
                  <Text
                    className={`text-lg font-medium ${isSelected ? "text-primary-light" : "text-gray-500"}`}
                  >
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mb-6">
            <Text className="text-text-primary text-lg font-bold mb-3">
              Quantity
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-surface rounded-full w-12 h-12 items-center justify-center"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                activeOpacity={0.7}
                disabled={!inStock}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={inStock ? "#FFFFFF" : "#666"}
                />
              </TouchableOpacity>

              <Text className="text-primary text-xl font-bold mx-6">
                {quantity}
              </Text>

              <TouchableOpacity
                className="bg-primary rounded-full w-12 h-12 items-center justify-center"
                onPress={() => setQuantity(quantity + 1)}
                activeOpacity={0.7}
                disabled={!inStock}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={!inStock ? "#666" : "#121212"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-text-primary text-lg font-bold mb-3">
              Description
            </Text>
            <Text className="text-text-secondary text-base leading-6">
              {(product as any).description ?? "Comming soon description"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface px-6 py-4 pb-8">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-text-secondary text-base font-bold">Total Price</Text>
            <Text className="text-primary text-2xl font-bold">
              ₹ {(product.price * quantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-2xl px-8 py-4 flex-row items-center ${!inStock ? "bg-surface" : "bg-primary"}`}
            activeOpacity={0.8}
            onPress={addToCart}
            disabled={!inStock}
          >
            <Ionicons
              name="cart"
              size={24}
              color={!inStock ? "#666" : "#121212"}
            />
            <Text
              className={`font-bold text-lg ml-2 ${!inStock ? "text-secondary" : "text-background"}`}
            >
              {!inStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
}
