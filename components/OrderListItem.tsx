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

const OrderListItem = ({ order }: OrderListItemProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <Pressable className="bg-white px-4 py-3 rounded-xl flex-row justify-between items-center">
        <View>
          <Text className="font-bold mb-1">
            Order #{order.id}
          </Text>

          <Text className="text-gray-500 text-sm">
            {dayjs(order.created_at).fromNow()}
          </Text>
        </View>

        <Text className="font-medium capitalize">
          {order.status}
        </Text>
      </Pressable>
    </Link>
  );
};

export default OrderListItem;
