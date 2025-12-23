import { Tables } from "@/assets/data/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useSegments } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Tables<"orders">;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  processing: "bg-blue-100 text-blue-800",
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const segments = useSegments();
  const statusStyle = statusColors[order.status.toLowerCase()] ?? "bg-gray-100 text-gray-800";

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <Pressable className="bg-white dark:bg-neutral-900 rounded-2xl px-4 py-4 flex-row justify-between items-center shadow-md mb-3 ">
        <View className="flex-1">
          <Text className="font-bold text-lg mb-1 text-black dark:text-white">
            Order #{order.id}
          </Text>
          <Text className="text-gray-500 dark:text-neutral-400 text-sm">
            {dayjs(order.created_at).fromNow()}
          </Text>
        </View>

        <View className={`px-3 py-1 rounded-full ${statusStyle}`}>
          <Text className="text-sm font-semibold capitalize">
            {order.status}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default OrderListItem;
