import { Tables } from "@/assets/data/types";
import { Link, useSegments } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type OrderItemListItemProps = {
  items: ({ products: Tables<"products"> } & Tables<"order_items">)[];
};

const OrderItemList = ({ items }: OrderItemListItemProps) => {
  const segments = useSegments();

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4">
      {items.map((item, index) => (
        <View key={item.id}>
          <View className="flex-row items-center">
            {/* Product Image */}
            <View className="relative">
              <Link href={`/${segments[0]}/menu/${item.products.id}`} asChild>
                <Pressable>
                  <RemoteImage
                    path={item.products.image ?? undefined}
                    fallback={defaultPizzaImage}
                    resizeMode="cover"
                    className="w-24 h-24 rounded-2xl bg-gray-100"
                  />
                </Pressable>
              </Link>

              {/* Quantity badge */}
              <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                <Text className="text-white text-xs font-bold">
                  ×{item.quantity}
                </Text>
              </View>
            </View>

            <View className="flex-1 ml-4 justify-between">
              {/* Product Name */}
              <View>
                {/* Name */}
                <Link href={`/${segments[0]}/menu/${item.products.id}`} asChild>
                  <Pressable>
                    <Text
                      className="text-black dark:text-white font-bold text-lg leading-tight"
                      numberOfLines={2}
                    >
                      {item.products.name}
                    </Text>
                  </Pressable>
                </Link>

                {/* Price + Size */}
                <View className="mt-2">
                  <Text className="text-text-secondary font-bold text-base">
                    ₹ {item.products.price.toFixed(2)}
                  </Text>
                  <Text className="text-gray-500 dark:text-neutral-400 text-sm">
                    Size:{" "}
                    <Text className=" text-primary font-bold">{item.size}</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View className="mx-5">
              <Text className="text-gray-500 dark:text-neutral-400 text-lg">
                Qty: {item.quantity}
              </Text>
              <Text className="text-gray-500 dark:text-neutral-400 text-sm">
                Total amt:{" "}
                <Text className="text-lg text-primary font-bold">
                  ₹ {(item.products.price * item.quantity).toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>

          {/* Divider except last item */}
          {index !== items.length - 1 && (
            <View className="border-t border-gray-200 dark:border-neutral-700 my-3" />
          )}
        </View>
      ))}
    </View>
  );
};

export default OrderItemList;
