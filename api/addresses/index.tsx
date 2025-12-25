// api/addresses/index.tsx
import { InsertTables, UpdateTables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* -------------------- LIST -------------------- */
export const useAddressList = (userId: string) => {
  return useQuery({
    queryKey: ["addresses", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .eq("deleted", false) // ✅ IMPORTANT
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
};

/* -------------------- DELETE -------------------- */
export const useDeleteAddress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(addressId: number) {
      // 1️⃣ Check if linked to orders
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("address_id", addressId)
        .limit(1);

      if (error) throw new Error(error.message);

      const isLinked = (data?.length ?? 0) > 0;

      // 2️⃣ If linked → SOFT DELETE
      if (isLinked) {
        const { error: updateError } = await supabase
          .from("addresses")
          .update({ deleted: true })
          .eq("id", addressId);

        if (updateError) throw new Error(updateError.message);
      }
      // 3️⃣ If NOT linked → HARD DELETE
      else {
        const { error: deleteError } = await supabase
          .from("addresses")
          .delete()
          .eq("id", addressId);

        if (deleteError) throw new Error(deleteError.message);
      }

      return addressId;
    },

    // ✅ Optimistic UI update
    onMutate(addressId) {
      queryClient.setQueryData<any[]>(
        ["addresses", userId],
        (old) => old?.filter((a) => a.id !== addressId) ?? []
      );
    },

    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["addresses", userId],
      });
    },
  });
};

/* -------------------- GET BY ID -------------------- */
export const useAddressById = (id?: number) => {
  return useQuery({
    queryKey: ["address", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("id", id!)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

/* -------------------- CREATE -------------------- */
export const useCreateAddress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(payload: InsertTables<"addresses">) {
      // Reset default if needed
      if (payload.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      }

      const { error } = await supabase.from("addresses").insert(payload);
      if (error) throw error;
    },

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

/* -------------------- UPDATE -------------------- */
export const useUpdateAddress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      data,
    }: {
      id: number;
      data: UpdateTables<"addresses">;
    }) {
      if (data.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      }

      const { error } = await supabase
        .from("addresses")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};
