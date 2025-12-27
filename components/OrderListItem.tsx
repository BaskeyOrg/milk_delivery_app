import { OrderWithItems } from "@/api/orders";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useSegments } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

dayjs.extend(relativeTime);

type Props = {
  order: OrderWithItems;
};

const statusColorMap: Record<string, { bg: string; text: string }> = {
  new: { bg: "bg-yellow-500/20", text: "text-yellow-600" },
  delivering: { bg: "bg-blue-500/20", text: "text-blue-600" },
  delivered: { bg: "bg-green-500/20", text: "text-green-600" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-600" },
};

export default function OrderListItem({ order }: Props) {
  const segments = useSegments();
  const status =
    statusColorMap[order.status?.toLowerCase()] ?? statusColorMap.new;

  const items = order.order_items ?? [];

  return (
    <View className="bg-surface rounded-3xl p-5">
      {/* Header */}
      <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
        <Pressable>
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text className="text-text-primary font-bold text-base mb-1">
                Order #{String(order.id).slice(-8)}
              </Text>

              <Text className="text-text-secondary text-sm font-bold">
                ₹ {Number(order.total ?? 0).toFixed(2)}
                <Text className="opacity-60"> • </Text>
                {dayjs(order.created_at).fromNow()}
              </Text>
            </View>

            <View className={`px-3 py-1.5 rounded-full ${status.bg}`}>
              <Text className={`text-xs font-bold capitalize ${status.text}`}>
                {order.status}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      {/* Order items preview (SAFE) */}
      {items.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {items.map((item) => {
            const image = item.products?.image;
            if (!image) return null;

            return (
              <View key={item.id} className="relative">
                <RemoteImage
                  path={image}
                  fallback={defaultPizzaImage}
                  className="w-16 h-16 rounded-xl bg-gray-200"
                />

                <View className="absolute -top-1 -right-1 bg-primary rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-background text-xs font-bold">
                    ×{item.quantity}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
