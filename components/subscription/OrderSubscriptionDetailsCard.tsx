import { Tables } from "@/assets/data/types";
import { formatDate } from "@/lib/date-format";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  subscription: Tables<"subscriptions">;
};

/* Helper to calculate end date based on plan */
const calculateEndDate = (
  startDate: string,
  planType: "weekly" | "monthly"
) => {
  const days = planType === "weekly" ? 6 : 29; // subtract 1 because start date counts as day 1
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return formatDate(date.toISOString());
};

export default function OrderSubscriptionDetailsCard({ subscription }: Props) {
  const planLabel =
    subscription.plan_type === "weekly"
      ? "Weekly Subscription"
      : "Monthly Subscription";

  const endDate = calculateEndDate(
    subscription.start_date,
    subscription.plan_type as "weekly" | "monthly"
  );
  return (
    <View className="bg-green-50 border border-green-200 rounded-xl p-4 gap-2">
      <View className="flex-row items-center gap-2">
        <Ionicons name="repeat" size={18} color="#16A34A" />
        <Text className="text-green-700 font-semibold">
          Subscription Details
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-text-secondary">Plan</Text>
        <Text className="font-medium text-text-primary">{planLabel}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-text-secondary">Duration</Text>
        <Text className="font-medium text-text-primary">
          {formatDate(subscription.start_date)} - {endDate}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-text-secondary">Delivery Time</Text>
        <Text className="font-medium text-text-primary">
          {subscription.delivery_time}
        </Text>
      </View>
    </View>
  );
}
