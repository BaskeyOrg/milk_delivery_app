import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePauseSubscription = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      from,
      to,
    }: {
      subscriptionId: number;
      from: string;
      to: string;
    }) => {
      const { error } = await supabase
        .from("subscription_pauses")
        .insert({
          subscription_id: subscriptionId,
          pause_from: from,
          pause_to: to,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useSkipDeliveryDay = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      date,
    }: {
      subscriptionId: number;
      date: string;
    }) => {
      const { error } = await supabase
        .from("subscription_skip_days")
        .insert({
          subscription_id: subscriptionId,
          skip_date: date,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
