import {
  useAddressById,
  useCreateAddress,
  useUpdateAddress,
} from "@/api/addresses";
import { AREAS } from "@/constants/area-location";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

  /* ---------------- STATE ---------------- */

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

  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------------- EDIT MODE ---------------- */

  useEffect(() => {
    if (!editAddress) return;
    setForm({
      full_name: editAddress.full_name,
      phone: editAddress.phone,
      street: editAddress.street || "",
      area: editAddress.area || "",
      city: editAddress.city || "Chennai",
      landmark: editAddress.landmark || "",
      label: editAddress.label || "",
      is_default: Boolean(editAddress.is_default),
    });
  }, [editAddress]);

  /* ---------------- HELPERS ---------------- */

  const update = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
    `rounded-xl border px-4 py-3 text-white bg-neutral-800 ${
      error && submitted ? "border-red-500" : "border-neutral-700"
    }`;

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    setSubmitted(true);
    if (!userId || saving || !isValid) return;

    setSaving(true);
    try {
      const payload = { ...form, user_id: userId };
      if (editId) {
        await updateAddress({ id: editId, data: payload });
      } else {
        await createAddress(payload);
      }

      router.push(
        returnTo === "cart"
          ? "/(user)/cart?openAddressModal=1"
          : "/(user)/address"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-neutral-900"
    >
      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* FULL NAME */}
        <TextInput
          placeholder="Full name"
          placeholderTextColor="#9CA3AF"
          value={form.full_name}
          onChangeText={(v) => update("full_name", v)}
          className={inputClass(errors.full_name)}
        />
        {submitted && errors.full_name && (
          <Text className="text-red-500 text-xs mt-1 ml-2">
            Full name is required
          </Text>
        )}

        {/* PHONE */}
        <TextInput
          placeholder="Mobile number"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={(v) => update("phone", v.replace(/[^0-9]/g, ""))}
          className={`${inputClass(errors.phone)} mt-4`}
        />
        {submitted && errors.phone && (
          <Text className="text-red-500 text-xs mt-1 ml-2">
            Mobile number must be 10 digits
          </Text>
        )}

        {/* STREET */}
        <TextInput
          placeholder="Flat / House / Building"
          placeholderTextColor="#9CA3AF"
          value={form.street}
          onChangeText={(v) => update("street", v)}
          className={`${inputClass(errors.street)} mt-4`}
        />
        {submitted && errors.street && (
          <Text className="text-red-500 text-xs mt-1 ml-2">
            Street is required
          </Text>
        )}

        {/* LANDMARK */}
        <TextInput
          placeholder="Landmark (optional)"
          placeholderTextColor="#9CA3AF"
          value={form.landmark}
          onChangeText={(v) => update("landmark", v)}
          className={`${inputClass()} mt-4`}
        />

        {/* AREA (Dropdown) */}
        <TouchableOpacity
          onPress={() => setShowAreaPicker(true)}
          className={`${inputClass(errors.area)} mt-4 justify-center`}
        >
          <Text className={form.area ? "text-white" : "text-gray-400"}>
            {form.area || "Select area"}
          </Text>
        </TouchableOpacity>
        {submitted && errors.area && (
          <Text className="text-red-500 text-xs mt-1 ml-2">
            Please select an area
          </Text>
        )}

        {/* CITY */}
        <TextInput
          placeholder="City"
          placeholderTextColor="#9CA3AF"
          value={form.city}
          onChangeText={(v) => update("city", v)}
          className={`${inputClass(errors.city)} mt-4`}
        />
        {submitted && errors.city && (
          <Text className="text-red-500 text-xs mt-1 ml-2">
            City is required
          </Text>
        )}

        {/* LABEL */}
        <TextInput
          placeholder="Label (Home / Work)"
          placeholderTextColor="#9CA3AF"
          value={form.label}
          onChangeText={(v) => update("label", v)}
          className={`${inputClass()} mt-4`}
        />

        {/* DEFAULT SWITCH */}
        <View className="flex-row justify-between items-center mt-6">
          <Text className="text-white font-medium">Set as default address</Text>
          <Switch
            value={form.is_default}
            onValueChange={(v) => update("is_default", v)}
          />
        </View>

        {/* SAVE */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`mt-8 rounded-xl py-4 ${
            saving ? "bg-gray-500" : "bg-primary"
          }`}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">
              Save Address
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* AREA PICKER */}
      {showAreaPicker && (
        <View className="absolute inset-0 bg-black/70 justify-center px-6">
          <View className="bg-neutral-900 rounded-2xl max-h-[70%]">
            <ScrollView>
              {AREAS.map((area) => (
                <TouchableOpacity
                  key={area}
                  onPress={() => {
                    update("area", area);
                    setShowAreaPicker(false);
                  }}
                  className="px-5 py-4 border-b border-neutral-800"
                >
                  <Text className="text-white text-base">{area}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowAreaPicker(false)}
              className="py-4"
            >
              <Text className="text-center text-red-400 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
