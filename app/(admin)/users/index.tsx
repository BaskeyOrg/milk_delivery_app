import { useAdminUsers } from "@/api/profile";
import { Tables } from "@/assets/data/types";
import { router } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminUsersScreen() {
  const { data: users, isLoading, error } = useAdminUsers();

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-500">Loading users...</Text>
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{(error as Error).message}</Text>
      </View>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(`/users/${item.id}`)}
          >
            <UserRow user={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-gray-500 text-lg">No users found</Text>
          </View>
        }
      />
    </View>
  );
}

/* ---------------- USER ROW ---------------- */

function UserRow({ user }: { user: Tables<"profiles"> }) {
  return (
    <View className="p-4 rounded-xl bg-white border border-gray-200">
      <Text className="text-lg font-semibold">
        {user.full_name || "Unnamed User"}
      </Text>

      {user.phone && (
        <Text className="text-gray-600 mt-1">📞 {user.phone}</Text>
      )}

      {user.username && (
        <Text className="text-gray-500 mt-1">@{user.username}</Text>
      )}

      <View className="flex-row justify-between mt-3">
        <Text className="text-xs text-gray-400">{user.id.slice(0, 8)}…</Text>

        <Text className="text-xs text-gray-400">Group: {user.group}</Text>
      </View>
    </View>
  );
}
