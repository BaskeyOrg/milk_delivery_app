import { Tables } from "@/assets/data/types";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useAddresses = (userId: string) => {
  const [addresses, setAddresses] = useState<Tables<"addresses">[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error) setAddresses(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [userId]);

  return { addresses, loading, reload: load } as const;
};
