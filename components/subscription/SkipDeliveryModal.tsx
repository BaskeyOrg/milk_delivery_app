import {
    usePauseSubscriptionDays,
    useSubscriptionPauses,
} from "@/api/subscription";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

type Props = {
  visible: boolean;
  onClose: () => void;
  subscriptionId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string | null;
};

export default function SkipDeliveryModal({
  visible,
  onClose,
  subscriptionId,
  startDate,
  endDate,
}: Props) {
  const [selectedDates, setSelectedDates] = useState<Record<string, any>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");

  const { data: pausedDays } = useSubscriptionPauses(subscriptionId);
  const { mutate, isPending } = usePauseSubscriptionDays();

  /* ---------------- DISABLED DATES ---------------- */
  const disabledDates = useMemo(() => {
    const map: Record<string, any> = {};
    pausedDays?.forEach((p) => {
      map[p.pause_date] = {
        disabled: true,
        disableTouchEvent: true,
        marked: true,
        dotColor: "red",
      };
    });
    return map;
  }, [pausedDays]);

  /* ---------------- TOGGLE DATE ---------------- */
  const onDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDates((prev) => {
      const copy = { ...prev };
      if (copy[date]) {
        delete copy[date];
      } else {
        copy[date] = { selected: true, selectedColor: "#ef4444" };
      }
      return copy;
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleConfirm = () => {
    const dates = Object.keys(selectedDates);
    if (!dates.length) return;

    mutate(
      { subscriptionId, dates, reason },
      {
        onSuccess: () => {
          setSelectedDates({});
          setReason("");
          setConfirmOpen(false);
          onClose();
        },
      }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        {/* Main modal */}
        <View className="bg-white rounded-t-2xl p-4 gap-4 max-h-[80%]">
          <Text className="text-lg font-bold">Skip Delivery Days</Text>

          <Calendar
            minDate={startDate}
            maxDate={endDate ?? undefined}
            markedDates={{ ...disabledDates, ...selectedDates }}
            onDayPress={onDayPress}
          />

          {/* Optional Reason */}
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Reason (optional)"
            className="border border-gray-300 p-3 rounded-lg mt-2"
          />

          {/* Submit button */}
          <TouchableOpacity
            disabled={!Object.keys(selectedDates).length || isPending}
            onPress={() => setConfirmOpen(true)}
            className={`py-4 rounded-xl items-center ${
              !Object.keys(selectedDates).length || isPending
                ? "bg-gray-400"
                : "bg-red-500"
            }`}
          >
            <Text className="text-white font-bold">Skip Selected Days</Text>
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            onPress={() => {
              setSelectedDates({});
              setReason("");
              onClose();
            }}
          >
            <Text className="text-center text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- CONFIRM ALERT MODAL ---------------- */}
        <Modal visible={confirmOpen} transparent animationType="fade">
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white rounded-xl p-6 w-11/12 max-h-[70%]">
              <Text className="text-lg font-bold mb-4 text-center">
                Confirm Skip
              </Text>
              <ScrollView className="mb-4">
                {Object.keys(selectedDates).map((d) => (
                  <Text key={d} className="text-center text-gray-700 py-1">
                    {d}
                  </Text>
                ))}
                {reason ? (
                  <Text className="text-center text-gray-500 mt-2">
                    Reason: {reason}
                  </Text>
                ) : null}
              </ScrollView>
              <View className="flex-row justify-around gap-4">
                <TouchableOpacity
                  onPress={() => setConfirmOpen(false)}
                  className="flex-1 py-3 bg-gray-200 rounded-lg items-center"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  className="flex-1 py-3 bg-red-500 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">Yes, Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}
