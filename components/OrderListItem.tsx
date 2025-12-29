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
  new: { bg: "bg-accent-warning/15", text: "text-accent-warning" },
  cooking: { bg: "bg-accent-warning/15", text: "text-accent-warning" },
  delivering: { bg: "bg-accent-info/15", text: "text-accent-info" },
  delivered: { bg: "bg-accent-success/15", text: "text-accent-success" },
  cancelled: { bg: "bg-accent-error/15", text: "text-accent-error" },
};

export default function OrderListItem({ order }: Props) {
  const segments = useSegments();
  const status =
    statusColorMap[order.status?.toLowerCase() ?? "new"] ??
    statusColorMap.new;

  const items = order.order_items ?? [];

  return (
    <View className="rounded-3xl p-5 bg-black/5 mx-3">
      {/* Header */}
      <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
        <Pressable
          accessible
          accessibilityLabel={`View details for order #${order.id}`}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text className="text-text-primary font-semibold text-base mb-1">
                Order #{String(order.id).slice(-8)}
              </Text>
              <Text className="text-text-secondary text-sm">
                ₹ {Number(order.total ?? 0).toFixed(2)}
                <Text className="opacity-60"> • </Text>
                {dayjs(order.created_at).fromNow()}
              </Text>
            </View>
            <View className={`px-3 py-1.5 rounded-full ${status.bg}`}>
              <Text className={`text-xs font-semibold capitalize ${status.text}`}>
                {order.status}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      {/* Items */}
      {items.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {items.map((item) => (
            <View key={item.id} className="relative">
              <RemoteImage
                path={item.products?.image ?? undefined}
                fallback={defaultPizzaImage}
                className="w-16 h-16 rounded-xl bg-black/10"
              />

              <View className="absolute -top-1 -right-1 bg-primary rounded-full min-w-[16px] h-6 items-center justify-center shadow-md px-1">
                <Text className="text-text-inverse text-xs font-bold">
                  ×{item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
