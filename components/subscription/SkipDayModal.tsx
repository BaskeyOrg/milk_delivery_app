import { useSkipDeliveryDay } from "@/api/subscription";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  subscriptionId?: number;
};

export default function SkipDayModal({
  visible,
  onClose,
  subscriptionId,
}: Props) {
  const [date, setDate] = useState("");
  const { mutate, isPending } = useSkipDeliveryDay();

  const submit = () => {
    if (!subscriptionId) return;
    mutate({ subscriptionId, date }, { onSuccess: onClose });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl p-6 gap-4">
          <Text className="text-lg font-bold">Skip Delivery</Text>

          <TouchableOpacity
            className="bg-background-subtle p-4 rounded-lg"
            onPress={() => setDate(new Date().toISOString().split("T")[0])}
          >
            <Text>{date || "Select date to skip"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!date || isPending}
            onPress={submit}
            className="bg-red-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Skip This Day</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
