import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useLocationContext } from "@/providers/LocationProvider";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddressFormModal({
  visible,
  onClose,
}: Props) {
  const { selectedAddress, setSelectedAddress } = useLocationContext();

  const [orderFor, setOrderFor] = useState<"self" | "other">("self");
  const [addressType, setAddressType] = useState<
    "Home" | "Work" | "Hotel" | "Other"
  >("Home");

  const [flat, setFlat] = useState("");
  const [floor, setFloor] = useState("");
  const [landmark, setLandmark] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    // 🔹 Later this can be replaced with real map / backend data
    const finalAddress = `ICAT Boys Hostel, Mylapore, Chennai`;

    setSelectedAddress(finalAddress);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">

          {/* MODAL */}
          <TouchableWithoutFeedback>
            <View className="bg-background rounded-t-3xl h-[50%] relative">

              {/* FLOATING CLOSE */}
              <Pressable
                onPress={onClose}
                className="absolute -top-16 self-center bg-surface-elevated rounded-full p-4 z-10"
              >
                <Ionicons name="close" size={22} color="#111827" />
              </Pressable>

              {/* HEADER */}
              <View className="px-5 pt-6 pb-4 border-b border-surface-border">
                <Text className="text-xl font-bold text-text-primary">
                  Enter complete address
                </Text>
              </View>

              {/* CONTENT */}
              <ScrollView
                className="px-5 py-4"
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
              >
                {/* ORDER FOR */}
                <Text className="text-text-secondary mb-3">
                  Who you are ordering for?
                </Text>

                <View className="flex-row gap-6 mb-5">
                  <Radio
                    label="Myself"
                    active={orderFor === "self"}
                    onPress={() => setOrderFor("self")}
                  />
                  <Radio
                    label="Someone else"
                    active={orderFor === "other"}
                    onPress={() => setOrderFor("other")}
                  />
                </View>

                {/* ADDRESS TYPE */}
                <View className="flex-row gap-3 mb-5">
                  {["Home", "Work", "Hotel", "Other"].map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      active={addressType === type}
                      onPress={() => setAddressType(type as any)}
                    />
                  ))}
                </View>

                <Input
                  label="Flat / House no / Building name *"
                  value={flat}
                  onChangeText={setFlat}
                />

                <Input
                  label="Floor (optional)"
                  value={floor}
                  onChangeText={setFloor}
                />

                {/* AREA */}
                <View className="mb-5">
                  <Text className="text-text-secondary mb-2">
                    Area / Sector / Locality *
                  </Text>
                  <View className="bg-surface border border-surface-border rounded-xl p-4">
                    <Text className="text-text-primary text-sm">
                      {selectedAddress}
                    </Text>
                    <Text className="text-primary mt-2 font-semibold">
                      Change
                    </Text>
                  </View>
                </View>

                <Input
                  label="Nearby landmark (optional)"
                  value={landmark}
                  onChangeText={setLandmark}
                />

                {/* RECEIVER DETAILS */}
                {orderFor === "other" && (
                  <>
                    <Text className="text-text-secondary mb-2 mt-2">
                      Add Receiver's Details
                    </Text>
                    <Input
                      label="Receiver's name *"
                      value={name}
                      onChangeText={setName}
                    />
                    <Input
                      label="Receiver's phone *"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </>
                )}

                {/* SELF DETAILS */}
                {orderFor === "self" && (
                  <>
                    <Text className="text-text-secondary mb-2 mt-2">
                      Enter your details
                    </Text>
                    <Input
                      label="Your name *"
                      value={name}
                      onChangeText={setName}
                    />
                    <Input
                      label="Your phone number (optional)"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </>
                )}
              </ScrollView>

              {/* FOOTER */}
              <View className="px-5 py-4 border-t border-surface-border absolute bottom-0 w-full bg-background">
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleSave}
                  className="bg-primary rounded-full py-4"
                >
                  <Text className="text-text-inverse text-center text-lg font-bold">
                    Save address
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* ------------------ UI PARTS ------------------ */

function Radio({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center gap-2">
      <View
        className={`w-5 h-5 rounded-full border-2 ${
          active ? "border-primary" : "border-text-tertiary"
        } items-center justify-center`}
      >
        {active && <View className="w-3 h-3 bg-primary rounded-full" />}
      </View>
      <Text className="text-text-primary">{label}</Text>
    </TouchableOpacity>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-xl border ${
        active
          ? "border-primary bg-background-subtle"
          : "border-surface-border bg-surface"
      }`}
    >
      <Text
        className={`font-medium ${
          active ? "text-primary" : "text-text-primary"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Input({
  label,
  keyboardType,
  value,
  onChangeText,
}: {
  label: string;
  keyboardType?: any;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="text-text-secondary mb-2">{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9ca3af"
        className="bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary"
      />
    </View>
  );
}
