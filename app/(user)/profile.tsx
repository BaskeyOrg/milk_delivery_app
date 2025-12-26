import SafeScreen from "@/components/SafeScreen";
import { Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
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
] as const;

const MENU_ITEMS_TWO = [
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
] as const;

export default function ProfileScreen() {
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

const handleMenuPress = (action: Href) => {
  router.push(action);
};


  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
      >
        {/* HEADER */}
        <View className="px-6 pb-8">
          <View className="bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              {/* Avatar */}
              <View className="bg-primary/20 rounded-full w-20 h-20 items-center justify-center">
                <Ionicons name="person" size={36} color="#1DB954" />
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

        {/* MENU GRID */}
        <View className="mx-6 mb-3">
          <View className="flex-row flex-wrap -mx-2">
            {MENU_ITEMS.map((item) => (
              <View key={item.id} className="w-1/2 px-2 mb-3">
                <TouchableOpacity
                  className="bg-surface rounded-2xl p-6 items-center justify-center"
                  activeOpacity={0.7}
                  onPress={() => handleMenuPress(item.action)}
                >
                  <View
                    className="rounded-full w-16 h-16 items-center justify-center mb-4"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>

                  <Text className="text-text-primary font-bold text-base text-center">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* MENU GRID */}
        <View className="mx-6 mb-3">
          <View className="flex-row flex-wrap -mx-2">
            {MENU_ITEMS_TWO.map((item) => (
              <View key={item.id} className="w-1/2 px-2 mb-3">
                <TouchableOpacity
                  className="bg-surface rounded-2xl p-6 items-center justify-center"
                  activeOpacity={0.7}
                  onPress={() => handleMenuPress(item.action)}
                >
                  <View
                    className="rounded-full w-16 h-16 items-center justify-center mb-4"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>

                  <Text className="text-text-primary font-bold text-base text-center">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ADMIN SECTION */}
        {profile?.group === "ADMIN" && (
          <View className="mx-6 mb-3 bg-surface rounded-2xl p-4">
            <Link href="/(admin)" asChild>
              <TouchableOpacity
                className="flex-row items-center justify-between py-2"
                activeOpacity={0.7}
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

        {/* SIGN OUT */}
        <TouchableOpacity
          className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
          activeOpacity={0.8}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="text-red-500 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}
