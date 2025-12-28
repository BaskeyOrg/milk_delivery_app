import { useAddressList, useDeleteAddress } from "@/api/addresses";
import AddressCard from "@/components/Address/AddressCard";
import GradientHeader from "@/components/GradientHeader";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

  const userId = session?.user.id ?? "";

  const { data: addresses = [], isLoading } = useAddressList(userId);
  const { mutate: deleteAddress, isPending } = useDeleteAddress(userId);

  const handleDelete = (id: number, label?: string | null) => {
    Alert.alert(
      "Delete address",
      `Delete ${label ?? "this address"}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteAddress(id) },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title="Your Addresses" />

      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 120, gap: 8, paddingHorizontal: 16 }}>
        {/* Loading */}
        {isLoading && (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#43ce4e" />
          </View>
        )}

        {/* Empty */}
        {!isLoading && addresses.length === 0 && (
          <View className="items-center justify-center px-6 py-20">
            <Ionicons name="location-outline" size={80} color="#9CA3AF" />
            <Text className="text-text-primary font-semibold text-xl mt-4">
              No addresses yet
            </Text>
            <Text className="text-text-secondary text-center mt-2">
              Add your first delivery address
            </Text>
          </View>
        )}

        {/* Address Cards */}
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

        {/* Add Address */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/(user)/address/create-address")}
          className="bg-primary rounded-full py-5 flex-row items-center justify-center"
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text className="text-white font-bold text-lg ml-2">
            Add Address
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
