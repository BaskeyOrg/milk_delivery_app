import { Tables } from "@/assets/data/types";
import { Link, useSegments } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type OrderItemListItemProps = {
  item: { products: Tables<"products"> } & Tables<"order_items">;
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  const segments = useSegments();

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-xl p-2 flex-row items-center mb-2">
      {/* Clickable Image */}
      <Link href={`/${segments[0]}/menu/${item.products.id}`} asChild>
        <Pressable>
          <RemoteImage
            path={item.products.image ?? undefined}
            fallback={defaultPizzaImage}
            resizeMode="contain"
            className="w-[75px] aspect-square mr-3 rounded-lg"
          />
        </Pressable>
      </Link>

      <View className="flex-1">
        {/* Clickable Title */}
        <Link href={`/${segments[0]}/menu/${item.products.id}`} asChild>
          <Pressable>
            <Text className="font-medium text-base mb-1 text-black dark:text-white">
              {item.products.name}
            </Text>
          </Pressable>
        </Link>

        <View className="flex-row items-center space-x-2">
          <Text className="text-gray-100 font-bold">
            ₹ {item.products.price.toFixed(2)}
          </Text>

          <Text className="text-gray-500 dark:text-gray-400 ml-3">
            Size: {item.size}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mx-2">
        <Text className="font-medium text-lg text-black dark:text-white mr-3">
          {item.quantity}
        </Text>
      </View>
    </View>
  );
};

export default OrderItemListItem;
