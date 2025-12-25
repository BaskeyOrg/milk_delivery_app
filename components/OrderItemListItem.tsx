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
    <View className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-4 mb-4">
      {items.map((item, index) => (
        <View key={item.id}>
          <View className="flex-row items-center mb-3">
            {/* Product Image */}
            <Link href={`/${segments[0]}/menu/${item.products.id}`} asChild>
              <Pressable>
                <RemoteImage
                  path={item.products.image ?? undefined}
                  fallback={defaultPizzaImage}
                  resizeMode="contain"
                  className="w-20 h-20 rounded-2xl mr-4"
                />
              </Pressable>
            </Link>

            <View className="flex-1">
              {/* Product Name */}
              <Link href={`/${segments[0]}/menu/${item.products.id}`} asChild>
                <Pressable>
                  <Text className="font-semibold text-black dark:text-white text-base mb-1">
                    {item.products.name}
                  </Text>
                </Pressable>
              </Link>

              <View className="">
                <Text className="text-primary font-bold text-sm">
                  ₹ {item.products.price.toFixed(2)}
                </Text>
                <Text className="text-gray-500 dark:text-neutral-400 text-sm">
                  Size: {item.size}
                </Text>
              </View>
            </View>

            <View className="mx-5">
              <Text className="font-semibold text-black dark:text-white text-lg">
                Qty: {item.quantity}
              </Text>
              <Text className="text-white font-bold text-sm">
                 Total amt:  ₹ {item.products.price * item.quantity}
                </Text>
            </View>
          </View>

          {/* Divider except last item */}
          {index !== items.length - 1 && (
            <View className="border-t border-gray-200 dark:border-neutral-700 my-2" />
          )}
        </View>
      ))}
    </View>
  );
};

export default OrderItemList;
