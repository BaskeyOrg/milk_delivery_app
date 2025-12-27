import { useProduct } from "@/api/products";
import { PizzaSize } from "@/assets/data/types";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(
    typeof isString === "string" ? isString : isString?.[0]
  );

  const { data: product, error, isLoading } = useProduct(id);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-gray-500 dark:text-gray-400">
          Product not found
        </Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <View className="flex-1 bg-white dark:bg-black px-4">
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable className="mr-4">
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={22}
                    color={Colors.light.tint}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* IMAGE CARD */}
      <View className="mt-4 rounded-3xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
        <RemoteImage
          path={product.image ?? undefined}
          fallback={defaultPizzaImage}
          className="w-full aspect-square"
        />
      </View>

      {/* DETAILS CARD */}
      <View className="mt-6 bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-sm">
        <Text className="text-2xl font-bold text-black dark:text-white">
          {product.name}
        </Text>

        <Text className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          ₹ {product.price}
        </Text>
      </View>
    </View>
  );
}
