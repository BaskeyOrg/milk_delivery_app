import { useAdminOrdersByUser } from "@/api/orders";
import { useAdminUpdateUser } from "@/api/profile/admin";
import { Tables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function AdminUserDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  /* ---------------- FETCH USER ---------------- */
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["admin-user", id],
    enabled: !!id,
    queryFn: async (): Promise<Tables<"profiles">> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  /* ---------------- FETCH USER ORDERS ---------------- */
  const { data: orders, isLoading: ordersLoading } = useAdminOrdersByUser(id);
  const { mutate: updateUser, isPending } = useAdminUpdateUser();

  /* ---------------- LOADING ---------------- */
  if (userLoading || ordersLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-500">Loading user details…</Text>
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (userError || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load user</Text>
      </View>
    );
  }
  const isActive = user.is_active ?? true;

  /* ---------------- UI ---------------- */
  return (
    <View className="flex-1 bg-background p-4">
      {/* USER INFO */}
      <View className="bg-white rounded-xl border p-4">
        <Text className="text-xl font-bold">
          {user.full_name ?? "Unnamed User"}
        </Text>

        {user.username && (
          <Text className="text-gray-500 mt-1">@{user.username}</Text>
        )}

        {user.phone && (
          <Text className="text-gray-600 mt-1">📞 {user.phone}</Text>
        )}

        <Text className="text-xs text-gray-400 mt-2">User ID: {user.id}</Text>

        <Text className="text-xs text-gray-400">Group: {user.group}</Text>
      </View>

      {/* USER MANAGEMENT */}
      <View className="bg-white rounded-xl border p-4 mt-4">
        <Text className="text-lg font-semibold mb-3">User Management</Text>

        {/* STATUS */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-700">Status</Text>

          <Pressable
            disabled={isPending}
            onPress={() =>
              updateUser({
                userId: user.id,
                updates: { is_active: !isActive },
              })
            }
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
            className={`px-4 py-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <Text className="text-white font-semibold">
              {isPending ? "Saving..." : isActive ? "Active" : "Inactive"}
            </Text>
          </Pressable>
        </View>

        {/* GROUP */}
        <View>
          <Text className="text-gray-700 mb-2">Group</Text>

          <View className="flex-row gap-3">
            {["USER", "DELIVERY"].map((grp) => (
              <Pressable
                key={grp}
                disabled={isPending}
                onPress={() =>
                  updateUser({
                    userId: user.id,
                    updates: { group: grp },
                  })
                }
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                })}
                className={`px-4 py-2 rounded-full border ${
                  user.group === grp
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={
                    user.group === grp ? "text-white" : "text-gray-700"
                  }
                >
                  {grp}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* ORDERS */}
      <Text className="text-lg font-semibold mt-6 mb-2">Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 12, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text className="text-gray-500 mt-6">No orders found</Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl border p-4">
            <View className="flex-row justify-between">
              <Text className="font-semibold">Order #{item.id}</Text>
              <Text className="text-sm text-gray-500">{item.status}</Text>
            </View>

            <Text className="mt-1 text-gray-600">Total: ₹{item.total}</Text>

            {item.subscription && (
              <Text className="text-xs text-indigo-500 mt-1">
                Subscription: {item.subscription.plan_type}
              </Text>
            )}

            <Text className="text-xs text-gray-400 mt-1">
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
