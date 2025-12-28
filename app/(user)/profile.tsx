import GradientHeader from "@/components/GradientHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

/* -------------------------------------------------------------------------- */
/*                               MENU CONFIG                                  */
/* -------------------------------------------------------------------------- */

type MenuItem = {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  action: Href;
};

const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 1,
    icon: "person-outline",
    title: "Edit Profile",
    color: "#3B82F6",
    action: "/profile/edit",
  },
  {
    id: 2,
    icon: "list-outline",
    title: "Orders",
    color: "#10B981",
    action: "/(user)/orders",
  },
];

const MENU_ITEMS_TWO: readonly MenuItem[] = [
  {
    id: 3,
    icon: "location-outline",
    title: "Addresses",
    color: "#F59E0B",
    action: "/(user)/address",
  },
  {
    id: 4,
    icon: "heart-outline",
    title: "Wishlist",
    color: "#EF4444",
    action: "/(user)/wishList",
  },
];

/* -------------------------------------------------------------------------- */
/*                               MENU CARD                                    */
/* -------------------------------------------------------------------------- */

type MenuCardProps = {
  item: MenuItem;
  onPress: (action: Href) => void;
};

const MenuCard = ({ item, onPress }: MenuCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(item.action)}
      className="bg-black/5 rounded-2xl p-6 items-center justify-center"
    >
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: item.color + "20" }}
      >
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>

      <Text className="text-text-primary font-bold text-base text-center">
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MENU GRID                                    */
/* -------------------------------------------------------------------------- */

const MenuGrid = ({
  items,
  onPress,
}: {
  items: readonly MenuItem[];
  onPress: (action: Href) => void;
}) => {
  return (
    <View className="mx-6 mb-3">
      <View className="flex-row flex-wrap -mx-2">
        {items.map((item) => (
          <View key={item.id} className="w-1/2 px-2 mb-3">
            <MenuCard item={item} onPress={onPress} />
          </View>
        ))}
      </View>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                              PROFILE SCREEN                                 */
/* -------------------------------------------------------------------------- */

export default function ProfileScreen() {
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMenuPress = (action: Href) => {
    router.push(action);
  };

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title="Profile" />
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
      >
        {/* ================= HEADER ================= */}
        <View className="px-6 pb-8">
          <View className="bg-black/5 rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="bg-primary/15 w-20 h-20 rounded-full items-center justify-center">
                <Ionicons name="person" size={36} color="#43ce4e" />
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {profile?.full_name || "User"}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {profile?.email || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= MENU ================= */}
        <MenuGrid items={MENU_ITEMS} onPress={handleMenuPress} />
        <MenuGrid items={MENU_ITEMS_TWO} onPress={handleMenuPress} />

        {/* ================= ADMIN ================= */}
        {profile?.group === "ADMIN" && (
          <View className="mx-6 mb-3 bg-black/5 rounded-2xl p-4">
            <Link href="/(admin)" asChild>
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center">
                  <Ionicons name="shield-outline" size={22} color="#F59E0B" />
                  <Text className="text-text-primary font-semibold ml-3">
                    Admin Panel
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </Link>
          </View>
        )}

        {/* ================= SIGN OUT ================= */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className="mx-6 mb-3 bg-black/5 rounded-2xl py-5 flex-row items-center justify-center border border-red-500/20"
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="text-red-500 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* ================= VERSION ================= */}
        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
