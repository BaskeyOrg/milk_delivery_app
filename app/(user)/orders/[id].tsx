import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscription";
import OrderAddressCard from "@/components/Address/OrderAddressCard";
import GradientHeader from "@/components/GradientHeader";
import OrderItemList from "@/components/OrderItemListItem";
import OrderSummeryFooter from "@/components/OrderSummeryFooter";
import OrderSubscriptionDetailsCard from "@/components/subscription/OrderSubscriptionDetailsCard";
import PauseVacationModal from "@/components/subscription/PauseVacationModal";
import SkipDayModal from "@/components/subscription/SkipDayModal";
import { generateBillHTML } from "@/utils/billTemplate";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type Plan = "weekly" | "monthly";
export type DeliveryTime = "morning" | "evening";

export default function OrderDetailsScreen() {
  const { id: idParam } = useLocalSearchParams();

  const [pauseOpen, setPauseOpen] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);

  const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);

  /* ---------------- INVALID ID ---------------- */
  if (!id || isNaN(id)) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-accent-error text-lg">Invalid Order ID</Text>
      </View>
    );
  }

  /* ---------------- FETCH ORDER ---------------- */
  const { data: order, isLoading, error } = useOrderDetails(id);

  // keeps subscription state in sync (pause / skip)
  useUpdateOrderSubscription(id);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#43ce4e" />
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-accent-error text-lg">
          Failed to fetch order
        </Text>
      </View>
    );
  }

  /* ---------------- ORDER LOGIC ---------------- */
  const isSubscribed = Boolean(order.subscription);
  const deliveryCharge = 0;

  const plan: Plan | null =
    order.subscription?.plan_type === "weekly" ||
    order.subscription?.plan_type === "monthly"
      ? order.subscription.plan_type
      : null;

  const deliveryTime: DeliveryTime | null =
    order.subscription?.delivery_time === "morning" ||
    order.subscription?.delivery_time === "evening"
      ? order.subscription.delivery_time
      : null;

  const itemsTotal = isSubscribed
    ? plan === "weekly"
      ? order.total / 7
      : plan === "monthly"
      ? order.total / 30
      : order.total
    : order.total;

  const startDate = order.subscription?.start_date ?? null;

  /* ---------------- BILL GENERATION ---------------- */
  const handleGenerateBill = async () => {
    try {
      setGeneratingBill(true);

      const html = generateBillHTML({
        order,
        itemsTotal,
        deliveryCharge,
      });

      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Order Bill",
      });
    } catch (err) {
      console.error("Bill generation failed", err);
    } finally {
      setGeneratingBill(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <View className="flex-1 bg-background">
      <GradientHeader title={`Order #${order.id}`} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        {/* ADDRESS */}
        {order.addresses && (
          <OrderAddressCard address={order.addresses} />
        )}
        {/* GENERATE BILL */}
            <TouchableOpacity
              disabled={generatingBill}
              onPress={handleGenerateBill}
              className={`py-3 rounded-lg ${
                generatingBill ? "bg-gray-400" : "bg-green-600"
              }`}
            >
              <Text className="text-white text-center font-semibold">
                {generatingBill ? "Generating Bill..." : "Generate Bill"}
              </Text>
            </TouchableOpacity>

        {/* SUBSCRIPTION */}
        {order.subscription && (
          <>
            <OrderSubscriptionDetailsCard
              subscription={order.subscription}
            />

            

            {/* SUBSCRIPTION ACTIONS */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={() => setPauseOpen(true)}
                className="bg-yellow-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Pause Subscription
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSkipOpen(true)}
                className="bg-red-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Skip Subscription
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ITEMS */}
        <OrderItemList items={order.order_items ?? []} />

        {/* SUMMARY */}
        <OrderSummeryFooter
          itemsTotal={itemsTotal}
          deliveryCharge={deliveryCharge}
          subscriptionPlan={isSubscribed ? plan : null}
          startDate={isSubscribed ? startDate : null}
          deliveryTime={isSubscribed ? deliveryTime : null}
        />
      </ScrollView>

      {/* MODALS */}
      <PauseVacationModal
        visible={pauseOpen}
        onClose={() => setPauseOpen(false)}
        subscriptionId={order.subscription?.id}
      />

      <SkipDayModal
        visible={skipOpen}
        onClose={() => setSkipOpen(false)}
        subscriptionId={order?.subscription?.id}
      />
    </View>
  );
}
