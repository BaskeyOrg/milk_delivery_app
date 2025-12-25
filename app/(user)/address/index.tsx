import AddressCard from "@/components/Address/AddressCard";
import { useAddresses } from "@/hooks/useAddresses";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddressesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { addresses, loading, reload } = useAddresses(session?.user.id ?? "");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (address: any) => {
    router.push(`/(user)/address/create-address?editId=${address.id}`);
  };

  const handleDelete = useCallback(
    async (addressId: number, label?: string | null) => {
      Alert.alert(
        "Delete address",
        `Are you sure you want to delete ${label ?? "this address"}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setDeletingId(addressId);
              const { error } = await supabase
                .from("addresses")
                .delete()
                .eq("id", addressId);
              setDeletingId(null);

              if (error) {
                Alert.alert("Error", "Could not delete address");
                return;
              }

              reload?.();
            },
          },
        ]
      );
    },
    [reload]
  );

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: "Your Addresses" }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 16 }}>
        {/* LOADING */}
        {loading && (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" />
          </View>
        )}

        {/* EMPTY STATE */}
        {!loading && addresses.length === 0 && (
          <View className="py-12 items-center">
            <Text className="text-gray-500 text-base">
              No addresses added yet
            </Text>
          </View>
        )}

        {/* ADDRESS LIST */}
        {!loading &&
          addresses.map((item) => (
            <AddressCard
              key={item.id}
              address={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeletingAddress={deletingId === item.id}
            />
          ))}

        {/* ADD ADDRESS CTA */}
        <TouchableOpacity
          className="bg-primary rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={() => router.push("/(user)/address/create-address")}
        >
          <View className="py-5 flex-row items-center justify-center">
            <>
              <Ionicons name="add" size={20} color="#121212" />
              <Text className="text-background font-bold text-lg mr-2">
                Add Address
              </Text>
            </>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
