import {
  useAddressById,
  useCreateAddress,
  useUpdateAddress,
} from "@/api/addresses";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

  const [full_name, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load edit data
  useEffect(() => {
    if (!editAddress) return;

    setFullName(editAddress.full_name);
    setStreet(editAddress.street);
    setCity(editAddress.city);
    setStateVal(editAddress.state);
    setZipCode(editAddress.zip_code);
    setPhone(editAddress.phone);
    setLabel(editAddress.label ?? "");
    setIsDefault(Boolean(editAddress.is_default));
  }, [editAddress]);

  const handleSave = async () => {
    if (!userId || saving) return;
    setSaving(true);

    try {
      const payload = {
        full_name,
        street,
        city,
        state: stateVal,
        zip_code,
        phone,
        label,
        is_default: isDefault,
        user_id: userId,
      };

      if (editId) {
        await updateAddress({
          id: editId,
          data: payload,
        });
      } else {
        await createAddress(payload);
      }

      if (returnTo === "cart") {
        router.push("/(user)/cart?openAddressModal=1");
      } else {
        router.push("/(user)/address");
      }
    } catch (e) {
      console.log("Save address error", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white dark:bg-neutral-900"
    >
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-gray-900 dark:text-white my-4">
          Add Address
        </Text>

        {[
          ["Full name", full_name, setFullName],
          ["Street", street, setStreet],
          ["City", city, setCity],
          ["State", stateVal, setStateVal],
          ["Zip code", zip_code, setZipCode],
          ["Phone", phone, setPhone],
          ["Label (Home / Work)", label, setLabel],
        ].map(([placeholder, value, setter]: any, index) => (
          <TextInput
            key={index}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={setter}
            className="mb-3 rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-neutral-800"
          />
        ))}

        {/* ✅ Default Address Toggle */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-gray-800 dark:text-white font-medium">
            Set as default address
          </Text>
          <Switch value={isDefault} onValueChange={setIsDefault} />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          disabled={saving}
          onPress={handleSave}
          className={`mt-6 rounded-xl py-4 ${
            saving ? "bg-gray-400" : "bg-primary"
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
    </KeyboardAvoidingView>
  );
}
