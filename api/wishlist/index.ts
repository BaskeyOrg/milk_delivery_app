import { Tables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ---------------- TYPES ---------------- */

export type WishlistItem = Tables<"wishlist"> & {
  products: Tables<"products">;
};

/* ---------------- CHECK STATUS ---------------- */

export const useWishlistStatus = (
  userId?: string,
  productId?: number
) => {
  return useQuery({
    queryKey: ["wishlist-status", userId, productId],
    enabled: !!userId && !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", userId!)
        .eq("product_id", productId!)
        .maybeSingle();

      if (error) throw error;

      return {
        isWishlisted: !!data,
        wishlistRowId: data?.id ?? null,
      };
    },
  });
};

/* ---------------- ADD ---------------- */

export const useAddToWishlist = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const { data, error } = await supabase
        .from("wishlist")
        .insert({
          user_id: userId!,
          product_id: productId,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess(_, productId) {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-status", userId, productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["wishlist", userId],
      });
    },
  });
};

/* ---------------- REMOVE ---------------- */

export const useRemoveFromWishlist = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlistId: number) => {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistId);

      if (error) throw error;
      return wishlistId;
    },

    onSuccess(_, wishlistId) {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-status"] });
    },
  });
};
