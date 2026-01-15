import { Tables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePauseSubscriptionDays = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      dates,
      reason,
    }: {
      subscriptionId: number;
      dates: string[]; // YYYY-MM-DD[]
      reason?: string;
    }) => {
      if (!dates.length) return;

      const rows = dates.map((date) => ({
        subscription_id: subscriptionId,
        pause_date: date,
        reason: reason ?? null,
      }));

      const { error } = await supabase
        .from("subscription_pauses")
        .insert(rows);

      if (error) throw error;
    },

    onSuccess: (_, { subscriptionId }) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({
        queryKey: ["subscription-pauses", subscriptionId],
      });
    },
  });
};


/* ============================
   GET PAUSED DAYS
   ============================ */
export const useSubscriptionPauses = (subscriptionId?: number) => {
  return useQuery<Tables<"subscription_pauses">[], Error>({
    queryKey: ["subscription-pauses", subscriptionId],
    enabled: !!subscriptionId,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_pauses")
        .select("*")
        .eq("subscription_id", subscriptionId!)
        .order("pause_date", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
};
