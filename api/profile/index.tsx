import { InsertTables, UpdateTables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ------------------------------
// Fetch My Profile
// ------------------------------
export const useMyProfile = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, phone, avatar_url, website, group, expo_push_token")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

// NEW: Add this to your profile API file
export const useMyAddresses = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ["addresses", userId],
    enabled: !!userId,
    queryFn: async () => {
      // 1. Add a guard check to satisfy TypeScript
      if (!userId) {
        throw new Error("User ID is required to fetch addresses");
      }

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        // Now userId is guaranteed to be a string here
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// ------------------------------
// Update Profile
// ------------------------------
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(updatedFields: UpdateTables<"profiles">) {
      if (!userId) throw new Error("User not authenticated");

      const updates = {
        ...updatedFields,
        id: userId,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },

    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError(error) {
      console.log("Profile update error:", error);
    },
  });
};

// ------------------------------
// Create Profile if missing (optional)
// ------------------------------
export const useCreateProfile = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(newData: InsertTables<"profiles">) {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .insert({ ...newData, user_id: userId })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
  });
};


