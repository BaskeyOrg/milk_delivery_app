import { useAdminOrderList } from "@/api/orders";
import { useInsertOrderSubscription } from "@/api/orders/subscription";
import OrderListItem from "@/components/OrderListItem";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterKey = "all" | "active" | "completed";

export default function AdminOrdersScreen() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const ACTIVE_STATUSES = ["New", "Cancelled", "Delivering"];
  const COMPLETED_STATUSES = ["Delivered"];

  const statuses =
    filter === "active"
      ? ACTIVE_STATUSES
      : filter === "completed"
        ? COMPLETED_STATUSES
        : undefined;

  const { data: orders, isLoading, error } = useAdminOrderList({ statuses });

  useInsertOrderSubscription();

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      const status = order.status?.trim() ?? "";

      if (filter === "completed") return COMPLETED_STATUSES.includes(status);

      if (filter === "active") return ACTIVE_STATUSES.includes(status);

      return true; // all
    });
  }, [orders, filter]);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-500">Loading orders...</Text>
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

  /* ---------------- MAIN UI ---------------- */
  return (
    <View className="flex-1 bg-white">
      {/* ---------------- FILTER BUTTONS ---------------- */}
      <View className="flex-row justify-around mx-4 my-4 bg-gray-100 rounded-full p-2">
        <FilterButton
          label="All"
          isActive={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterButton
          label="Active"
          isActive={filter === "active"}
          onPress={() => setFilter("active")}
        />
        <FilterButton
          label="Completed"
          isActive={filter === "completed"}
          onPress={() => setFilter("completed")}
        />
      </View>

      {/* ---------------- ORDERS LIST ---------------- */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
          gap: 16,
        }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-gray-500 text-lg">No orders found</Text>
          </View>
        }
      />
    </View>
  );
}

/* ---------------- FILTER BUTTON ---------------- */

function FilterButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 9999,
        backgroundColor: isActive ? "white" : "transparent",
        shadowColor: isActive ? "#000" : "transparent",
        shadowOpacity: isActive ? 0.1 : 0,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          color: isActive ? "#43ce4e" : "#6b7280",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
