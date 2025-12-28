import { useProduct } from "@/api/products";
import { PizzaSize } from "@/assets/data/types";
import OverlayHeader from "@/components/OverlayHeader";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import { useCart } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    <View className="flex-1 bg-background">
      {/* OVERLAY HEADER */}
      <OverlayHeader
        rightSlot={
          <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
            <Ionicons name="heart-outline" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* IMAGE */}
        <View className="relative">
          <RemoteImage
            path={product?.image ?? undefined}
            fallback={defaultPizzaImage}
            resizeMode="cover"
            className="w-full h-96 rounded-2xl"
          />
        </View>

        {/* CONTENT */}
        <View className="p-6">
          <Text className="text-text-primary text-3xl font-bold mb-2">
            {product.name}
          </Text>

          <Text className="text-primary text-3xl font-bold mb-4">
            ₹ {product.price}
          </Text>
          <Text className="text-text-primary font-semibold mb-2">
            Select size
          </Text>
          <View className="flex-row justify-between mb-4">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`w-12 aspect-square rounded-full items-center justify-center ${
                    isSelected
                      ? "bg-primary border border-primary"
                      : "bg-background-subtle"
                  }`}
                >
                  <Text
                    className={`text-lg font-medium ${
                      isSelected ? "text-text-primary" : "text-text-tertiary"
                    }`}
                  >
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* QUANTITY */}
          <View className="mb-6">
            <Text className="text-text-primary text-lg font-bold mb-3">
              Quantity
            </Text>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-background-subtle rounded-full w-12 h-12 items-center justify-center"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>

              <Text className="text-primary text-xl font-bold mx-6">
                {quantity}
              </Text>

              <TouchableOpacity
                className="bg-primary rounded-full w-12 h-12 items-center justify-center"
                onPress={() => setQuantity(quantity + 1)}
                disabled={!inStock}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <View className="mb-8">
            <Text className="text-text-primary text-lg font-bold mb-3">
              Description
            </Text>
            <Text className="text-text-secondary text-base leading-6">
              {(product as any).description ?? "Coming soon description"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View className="absolute bottom-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-background-subtle px-6 py-4 pb-8 mt-4">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-text-secondary text-base font-bold">
              Total Price
            </Text>
            <Text className="text-primary text-2xl font-bold">
              ₹ {(product.price * quantity).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            className={"rounded-full px-8 py-4 flex-row items-center bg-primary"}
            onPress={addToCart}
            disabled={!inStock}
          >
            <Ionicons
              name="cart"
              size={24}
              color={!inStock ? "#666" : "#121212"}
            />
            <Text
              className={`font-bold text-lg ml-2 ${
                !inStock ? "text-secondary" : "text-background"
              }`}
            >
              {!inStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
