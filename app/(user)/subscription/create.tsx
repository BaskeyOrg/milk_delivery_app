import GradientHeader from "@/components/GradientHeader";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

/* ---------- HELPERS ---------- */

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function CreateSubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    productId: string;
    variant: string;
    price: string;
  }>();

  /* ---------- STATE ---------- */

  const [plan, setPlan] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [deliveryTime, setDeliveryTime] = useState<"morning" | "evening">(
    "morning"
  );

  const today = formatDate(new Date());
  const [startDate, setStartDate] = useState(today);

  /* ---------- RANGE CALCULATION ---------- */

  const rangeLength = useMemo(() => {
    if (plan === "weekly") return 7;
    if (plan === "monthly") return 30;
    return 1;
  }, [plan]);

  /* ---------- CALENDAR MARKING ---------- */

  const markedDates = useMemo(() => {
    const markings: Record<string, any> = {};

    const start = new Date(startDate);

    for (let i = 0; i < rangeLength; i++) {
      const date = formatDate(addDays(start, i));

      markings[date] = {
        selected: true,
        selectedColor: "#16a34a",
        selectedTextColor: "#ffffff",
      };
    }

    return markings;
  }, [startDate, rangeLength]);

  /* ---------- CREATE SUBSCRIPTION ---------- */

  const createSubscription = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_type: plan,
          start_date: startDate,
        })
        .select()
        .single();

      if (error || !subscription) throw error;

      await supabase.from("subscription_items").insert({
        subscription_id: subscription.id,
        product_id: Number(params.productId),
        variant_label: params.variant,
        variant_price: Number(params.price),
        quantity: 1,
        delivery_time: deliveryTime,
      });

      router.replace("/(user)/orders");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to create subscription");
    }
  };

  /* ---------- UI ---------- */

  return (
    <View className="flex-1 bg-background">
      <GradientHeader title="Create Subscription" />

      <View className="p-6 gap-6">
        {/* PLAN */}
        <Text className="text-lg font-semibold">Plan</Text>

        <View className="flex-row gap-3">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPlan(p)}
              className={`px-4 py-2 rounded-full ${
                plan === p ? "bg-primary" : "bg-background-subtle"
              }`}
            >
              <Text className={plan === p ? "text-white" : ""}>
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* START DATE */}
        <Text className="text-lg font-semibold">
          Start Date{" "}
          {plan !== "daily" && (
            <Text className="text-sm text-gray-500">
              ({rangeLength} days highlighted)
            </Text>
          )}
        </Text>

        <Calendar
          minDate={today}
          markedDates={markedDates}
          onDayPress={(day) => setStartDate(day.dateString)}
          theme={{
            todayTextColor: "#16a34a",
            arrowColor: "#16a34a",
            selectedDayBackgroundColor: "#16a34a",
          }}
        />

        {/* DELIVERY TIME */}
        <Text className="text-lg font-semibold">Delivery Time</Text>

        <View className="flex-row gap-3">
          {(["morning", "evening"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setDeliveryTime(t)}
              className={`px-4 py-2 rounded-full ${
                deliveryTime === t ? "bg-primary" : "bg-background-subtle"
              }`}
            >
              <Text className={deliveryTime === t ? "text-white" : ""}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CONFIRM */}
        <TouchableOpacity
          onPress={createSubscription}
          className="bg-primary py-4 rounded-xl items-center mt-4"
        >
          <Text className="text-white font-bold text-lg">
            Confirm Subscription
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
