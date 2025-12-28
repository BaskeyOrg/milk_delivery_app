import {
  useAddressById,
  useCreateAddress,
  useUpdateAddress,
} from "@/api/addresses";
import GradientHeader from "@/components/GradientHeader";
import { AREAS } from "@/constants/area-location";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------------- CONSTANTS ---------------- */

const phoneRegex = /^[0-9]{10}$/;

/* ---------------- COMPONENT ---------------- */

export default function CreateAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params?.editId ? Number(params.editId) : undefined;
  const returnTo = params?.returnTo as string | undefined;

  const { session } = useAuth();
  const userId = session?.user.id ?? "";

  const { data: editAddress } = useAddressById(editId);
  const { mutateAsync: createAddress } = useCreateAddress(userId);
  const { mutateAsync: updateAddress } = useUpdateAddress(userId);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    street: "",
    area: "",
    city: "Chennai",
    landmark: "",
    label: "",
    is_default: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAreaPicker, setShowAreaPicker] = useState(false);

  useEffect(() => {
    if (!editAddress) return;
    setForm({
      full_name: editAddress.full_name,
      phone: editAddress.phone,
      street: editAddress.street ?? "",
      area: editAddress.area ?? "",
      city: editAddress.city ?? "Chennai",
      landmark: editAddress.landmark ?? "",
      label: editAddress.label ?? "",
      is_default: !!editAddress.is_default,
    });
  }, [editAddress]);

  const update = (k: keyof typeof form, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const errors = useMemo(
    () => ({
      full_name: !form.full_name.trim(),
      phone: !phoneRegex.test(form.phone),
      street: !form.street.trim(),
      area: !form.area.trim(),
      city: !form.city.trim(),
    }),
    [form]
  );

  const isValid = !Object.values(errors).some(Boolean);

  /* ---------------- UI HELPERS ---------------- */

  const inputClass = (error?: boolean) =>
    [
      "rounded-2xl px-4 py-4 text-base",
      "bg-surface text-text-primary",
      "border",
      error && submitted ? "border-accent-error" : "border-border",
    ].join(" ");

  const handleSave = async () => {
    setSubmitted(true);
    if (!isValid || saving) return;

    setSaving(true);
    try {
      const payload = { ...form, user_id: userId };
      editId
        ? await updateAddress({ id: editId, data: payload })
        : await createAddress(payload);

      router.push(
        returnTo === "cart"
          ? "/(user)/cart?openAddressModal=1"
          : "/(user)/address"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      {/* ✅ Gradient Header */}
      <GradientHeader title={editId ? "Edit Address" : "Add Address"} />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Full Name */}
        <TextInput
          placeholder="Full name"
          placeholderTextColor="#9CA3AF"
          value={form.full_name}
          onChangeText={(v) => update("full_name", v)}
          className={inputClass(errors.full_name)}
        />

        {/* Phone */}
        <TextInput
          placeholder="Mobile number"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={(v) => update("phone", v.replace(/[^0-9]/g, ""))}
          className={`${inputClass(errors.phone)} mt-4`}
        />

        {/* Street */}
        <TextInput
          placeholder="Flat / House / Building"
          placeholderTextColor="#9CA3AF"
          value={form.street}
          onChangeText={(v) => update("street", v)}
          className={`${inputClass(errors.street)} mt-4`}
        />

        {/* Landmark */}
        <TextInput
          placeholder="Landmark (optional)"
          placeholderTextColor="#9CA3AF"
          value={form.landmark}
          onChangeText={(v) => update("landmark", v)}
          className={`${inputClass()} mt-4`}
        />

        {/* Area */}
        <TouchableOpacity
          onPress={() => setShowAreaPicker(true)}
          className={`${inputClass(errors.area)} mt-4`}
          activeOpacity={0.85}
        >
          <Text
            className={form.area ? "text-text-primary" : "text-text-tertiary"}
          >
            {form.area || "Select area"}
          </Text>
        </TouchableOpacity>

        {/* City */}
        <TextInput
          placeholder="City"
          placeholderTextColor="#9CA3AF"
          value={form.city}
          onChangeText={(v) => update("city", v)}
          className={`${inputClass(errors.city)} mt-4`}
        />

        {/* Label */}
        <View className="mt-4">
          <Text className="mb-2 text-text-primary font-medium">
            Address Label
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {["Home", "Work", "Office", "Other"].map((label) => {
              const isActive = form.label === label;

              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => update("label", label)}
                  className={`px-5 py-3 rounded-full border
            ${isActive ? "bg-primary border-primary" : "bg-white border-gray-300"}
          `}
                >
                  <Text
                    className={`font-medium
              ${isActive ? "text-white" : "text-text-primary"}
            `}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Default Switch */}
        <View className="flex-row items-center justify-between mt-6">
          <Text className="text-text-primary font-medium text-base">
            Set as default address
          </Text>
          <Switch
            value={form.is_default}
            onValueChange={(v) => update("is_default", v)}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.9}
          className={`mt-8 rounded-full py-5 ${
            saving ? "bg-surface" : "bg-primary"
          }`}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-center text-on-primary font-bold text-lg">
              Save Address
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      {/* AREA PICKER MODAL */}
      <Modal
        visible={showAreaPicker}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowAreaPicker(false)}
      >
        {/* Backdrop (click outside to close) */}
        <Pressable
          className="flex-1 bg-overlay"
          onPress={() => setShowAreaPicker(false)}
        />

        {/* Bottom Sheet */}
        <View className="bg-background rounded-t-3xl max-h-[35%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-border bg-background-muted">
            <Text className="text-text-primary text-lg font-semibold">
              Select Area
            </Text>

            <TouchableOpacity
              onPress={() => setShowAreaPicker(false)}
              hitSlop={12}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <Text className="text-text-secondary text-xl">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Area List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {AREAS.map((area) => {
              const isSelected = form.area === area;

              return (
                <TouchableOpacity
                  key={area}
                  onPress={() => {
                    update("area", area);
                    setShowAreaPicker(false);
                  }}
                  activeOpacity={0.85}
                  className={`px-5 py-4 flex-row items-center justify-between
              ${isSelected ? "bg-primary/10" : ""}
            `}
                >
                  <Text
                    className={`text-base
                ${isSelected ? "text-primary font-semibold" : "text-text-primary"}
              `}
                  >
                    {area}
                  </Text>

                  {isSelected && (
                    <Text className="text-primary text-lg">✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
