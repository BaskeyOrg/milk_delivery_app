import Button from "@/components/Button";
import { Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "expo-router";
import { View } from "react-native";

export default function ProfileScreen() {
  const { profile } = useAuth();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View>
      <Text>{JSON.stringify(profile)}</Text>

      {profile?.group === "ADMIN" && (
        <Link href="/(admin)" asChild>
          <Button text="Admin" />
        </Link>
      )}

      <Button text="Sign out" onPress={handleSignOut} />
    </View>
  );
}
