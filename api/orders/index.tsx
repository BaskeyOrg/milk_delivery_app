import { UpdateTables } from "@/assets/data/types";
import { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ---------------- TYPES ---------------- */

export type OrderWithItems = Tables<"orders"> & {
  order_items: (Tables<"order_items"> & {
    products: Tables<"products"> | null;
  })[];
  addresses: Tables<"addresses"> | null;
};

/* ---------------- ADMIN ORDERS ---------------- */

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  return useQuery<Tables<"orders">[], Error>({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
};

/* ---------------- USER ORDERS ---------------- */

export const useMyOrderList = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery<OrderWithItems[], Error>({
    queryKey: ["orders", { user_id: userId }],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*, products (*))
        `
        )
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as OrderWithItems[];
    },
  });
};

/* ---------------- ORDER DETAILS ---------------- */

export const useOrderDetails = (id: number) => {
  return useQuery<OrderWithItems, Error>({
    queryKey: ["orders", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          addresses (*),
          order_items (
            *,
            products (*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Order details fetch error:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Order not found");
      }

      return data as OrderWithItems;
    },
  });
};
/* ---------------- UPDATE ORDER ---------------- */

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) => {
      const finalFields = {
        ...updatedFields,
        ...(updatedFields.status && {
          status_updated_at: new Date().toISOString(),
        }),
      };

      const { data, error } = await supabase
        .from("orders")
        .update(finalFields)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
};

/* ---------------- INSERT ORDER ---------------- */

export const useInsertOrder = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      total,
      address_id,
    }: {
      total: number;
      address_id?: number | null;
    }) => {
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          total,
          address_id: address_id ?? null,
          status: "New",
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
