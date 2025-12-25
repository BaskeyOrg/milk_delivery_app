// app/(user)/address/index.tsx
import { useAddressList, useDeleteAddress } from "@/api/addresses";
import AddressCard from "@/components/Address/AddressCard";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
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

  const { data: addresses = [], isLoading } = useAddressList(
    session?.user.id ?? ""
  );

  const { mutate: deleteAddress, isPending } = useDeleteAddress(
    session?.user.id ?? ""
  );

  const handleDelete = (addressId: number, label?: string | null) => {
    Alert.alert(
      "Delete address",
      `Are you sure you want to delete ${label ?? "this address"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(addressId),
        },
      ]
    );
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: "Your Addresses" }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 16 }}>
        {isLoading && (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" />
          </View>
        )}

        {!isLoading && addresses.length === 0 && (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="location-outline" size={80} color="#666" />
            <Text className="text-text-primary font-semibold text-xl mt-4">
              No addresses yet
            </Text>
            <Text className="text-text-secondary text-center mt-2">
              Add your first delivery address
            </Text>
          </View>
        )}

        {addresses.map((item) => (
          <AddressCard
            key={item.id}
            address={item}
            onEdit={() =>
              router.push(`/(user)/address/create-address?editId=${item.id}`)
            }
            onDelete={handleDelete}
            isDeletingAddress={isPending}
          />
        ))}

        <TouchableOpacity
          className="bg-primary rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={() => router.push("/(user)/address/create-address")}
        >
          <View className="py-5 flex-row items-center justify-center">
            <Ionicons name="add" size={20} color="#121212" />
            <Text className="text-background font-bold text-lg ml-2">
              Add Address
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
