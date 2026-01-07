import React, { useMemo } from "react";
import { Text, View } from "react-native";

export type SubscriptionPlan = "weekly" | "monthly" | null;
export type DeliveryTime = "morning" | "evening" | null;

export type OrderBillFooterProps = {
  itemsTotal: number;
  deliveryCharge?: number;
  subscriptionPlan?: SubscriptionPlan;
  startDate?: string | null;
  deliveryTime?: DeliveryTime;
};

const PLAN_DAYS: Record<Exclude<SubscriptionPlan, null>, number> = {
  weekly: 7,
  monthly: 30,
};

const OrderSummeryFooter = ({
  itemsTotal,
  deliveryCharge = 0,
  subscriptionPlan = null,
  startDate = null,
  deliveryTime = null,
}: OrderBillFooterProps) => {
  const subscriptionDays = subscriptionPlan
    ? PLAN_DAYS[subscriptionPlan]
    : 1;

  const subscriptionItemsTotal = useMemo(
    () => itemsTotal * subscriptionDays,
    [itemsTotal, subscriptionDays]
  );

  const grandTotal = subscriptionItemsTotal + deliveryCharge;

  return (
    <View className="bg-background-card rounded-3xl p-5 bg-black/5">
      {/* Header */}
      <Text className="text-text-primary text-xl font-bold mb-4">
        Summary
      </Text>

      <View className="space-y-3">
        {/* Items */}
        <View className="flex-row justify-between">
          <Text className="text-text-secondary">
            Items Total (per day)
          </Text>
          <Text className="font-bold">₹ {itemsTotal.toFixed(2)}</Text>
        </View>

        {/* Subscription info */}
        {subscriptionPlan && (
          <>
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Plan</Text>
              <Text className="font-bold capitalize">{subscriptionPlan}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Duration</Text>
              <Text className="font-bold">{subscriptionDays} days</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-text-secondary">
                Items × {subscriptionDays} days
              </Text>
              <Text className="font-bold">
                ₹ {subscriptionItemsTotal.toFixed(2)}
              </Text>
            </View>

            {startDate && (
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Start Date</Text>
                <Text className="font-bold">{startDate}</Text>
              </View>
            )}

            {deliveryTime && (
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Delivery Time</Text>
                <Text className="font-bold capitalize">{deliveryTime}</Text>
              </View>
            )}
          </>
        )}

        {/* Delivery */}
        <View className="flex-row justify-between">
          <Text className="text-text-secondary">Delivery</Text>
          <Text className="font-bold">₹ {deliveryCharge.toFixed(2)}</Text>
        </View>

        {/* Total */}
        <View className="flex-row justify-between mt-3">
          <Text className="text-text-primary font-bold text-lg">Total</Text>
          <Text className="text-primary font-bold text-2xl">
            ₹ {grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderSummeryFooter;
