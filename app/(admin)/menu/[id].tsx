import { useProduct } from "@/api/products";
import { defaultImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function ProductDetailsScreen() {
  const { id: isString } = useLocalSearchParams();
  const id = Number(typeof isString === "string" ? isString : isString?.[0]);

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
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-gray-500 dark:text-gray-400">
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black px-4">
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable className="mr-4">
                <FontAwesome
                  name="pencil"
                  size={22}
                  color={Colors.light.tint}
                />
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* IMAGE */}
      <View className="mt-4 rounded-3xl overflow-hidden bg-gray-100">
        <RemoteImage
          path={product.image ?? undefined}
          fallback={defaultImage}
          className="w-full aspect-square"
        />
      </View>

      {/* DETAILS */}
      <View className="mt-6 bg-white rounded-3xl p-5 shadow-sm">
        <Text className="text-2xl font-bold">{product.name}</Text>

        {/* VARIANTS */}
        <View className="mt-4">
          <Text className="text-lg font-semibold mb-2">Variants</Text>

          {product.variants.map((v) => (
            <View
              key={v.label}
              className="flex-row justify-between py-2 border-b border-gray-200"
            >
              <Text className="text-base">{v.label}</Text>
              <Text className="text-base font-bold">₹ {v.price}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
