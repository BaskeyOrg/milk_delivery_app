import { usePauseSubscription } from "@/api/subscription";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  subscriptionId?: number;
};

export default function PauseVacationModal({
  visible,
  onClose,
  subscriptionId,
}: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { mutate, isPending } = usePauseSubscription();

  const submit = () => {
    if (!subscriptionId) return;

    mutate(
      {
        subscriptionId, // now TS knows it's a number
        from,
        to,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl p-6 gap-4">
          <Text className="text-lg font-bold">Pause Subscription</Text>

          <Text className="text-sm text-gray-500">
            No deliveries during vacation period
          </Text>

          {/* Replace with date picker if needed */}
          <TouchableOpacity
            className="bg-background-subtle p-4 rounded-lg"
            onPress={() => setFrom(new Date().toISOString().split("T")[0])}
          >
            <Text>From: {from || "Select date"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-background-subtle p-4 rounded-lg"
            onPress={() => setTo(new Date().toISOString().split("T")[0])}
          >
            <Text>To: {to || "Select date"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!from || !to || isPending}
            onPress={submit}
            className="bg-yellow-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
