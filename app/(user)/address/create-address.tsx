import {
  useAddressById,
  useCreateAddress,
  useUpdateAddress,
} from "@/api/addresses";
import { AREAS } from "@/constants/area-location";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

  const inputClass = (error?: boolean) =>
    `rounded-xl border px-4 py-3 bg-white text-text-primary ${
      error && submitted ? "border-red-500" : "border-gray-200"
    }`;

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
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* INPUTS */}
        <TextInput
          placeholder="Full name"
          value={form.full_name}
          onChangeText={(v) => update("full_name", v)}
          className={inputClass(errors.full_name)}
        />

        <TextInput
          placeholder="Mobile number"
          keyboardType="number-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={(v) => update("phone", v.replace(/[^0-9]/g, ""))}
          className={`${inputClass(errors.phone)} mt-4`}
        />

        <TextInput
          placeholder="Flat / House / Building"
          value={form.street}
          onChangeText={(v) => update("street", v)}
          className={`${inputClass(errors.street)} mt-4`}
        />

        <TextInput
          placeholder="Landmark (optional)"
          value={form.landmark}
          onChangeText={(v) => update("landmark", v)}
          className={`${inputClass()} mt-4`}
        />

        {/* AREA */}
        <TouchableOpacity
          onPress={() => setShowAreaPicker(true)}
          className={`${inputClass(errors.area)} mt-4`}
        >
          <Text className={form.area ? "text-text-primary" : "text-gray-400"}>
            {form.area || "Select area"}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="City"
          value={form.city}
          onChangeText={(v) => update("city", v)}
          className={`${inputClass(errors.city)} mt-4`}
        />

        <TextInput
          placeholder="Label (Home / Work)"
          value={form.label}
          onChangeText={(v) => update("label", v)}
          className={`${inputClass()} mt-4`}
        />

        {/* DEFAULT */}
        <View className="flex-row justify-between items-center mt-6">
          <Text className="text-text-primary font-medium">
            Set as default address
          </Text>
          <Switch value={form.is_default} onValueChange={(v) => update("is_default", v)} />
        </View>

        {/* SAVE */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`mt-8 rounded-xl py-4 ${
            saving ? "bg-gray-300" : "bg-primary"
          }`}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">
              Save Address
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* AREA PICKER */}
      {showAreaPicker && (
        <View className="absolute inset-0 bg-black/40 justify-center px-6">
          <View className="bg-white rounded-2xl max-h-[70%] overflow-hidden">
            <ScrollView>
              {AREAS.map((area) => (
                <TouchableOpacity
                  key={area}
                  onPress={() => {
                    update("area", area);
                    setShowAreaPicker(false);
                  }}
                  className="px-5 py-4 border-b border-gray-100"
                >
                  <Text className="text-text-primary">{area}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowAreaPicker(false)}
              className="py-4"
            >
              <Text className="text-center text-red-500 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
