import { InsertTables, Tables, UpdateTables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ---------------- TYPES ---------------- */

export type OrdersInsert = InsertTables<"orders">;
export type BaseOrder = Tables<"orders"> & {
  addresses?: Tables<"addresses"> | null;
};


export type OrderWithItems = Tables<"orders"> & {
  order_items: (Tables<"order_items"> & {
    products: Tables<"products">;
  })[];

  addresses: Tables<"addresses"> | null;

  subscription: Tables<"subscriptions"> | null;
};

/* ---------------- ADMIN ORDERS ---------------- */

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cancelled", "Delivering"];

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

/* ---------------- USER ORDERS LIST ---------------- */

export const useMyOrderList = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery<OrderWithItems[], Error>({
    queryKey: ["orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            products (*)
          ),
          subscription:subscriptions (*)
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

export const useOrderDetails = (orderId: number) => {
  return useQuery<OrderWithItems, Error>({
    queryKey: ["order", orderId],
    enabled: !!orderId,
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
          ),
          subscription:subscriptions (*)
        `
        )
        .eq("id", orderId)
        .single();

      if (error) throw new Error(error.message);
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
      const { data, error } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });
};

/* ---------------- INSERT ORDER ---------------- */

export const useInsertOrder = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: OrdersInsert) => {
      if (!session?.user.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...order,
          user_id: session.user.id,
          status: "New",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
