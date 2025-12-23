import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
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
  const { session } = useAuth();

  const [full_name, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFullName("");
    setStreet("");
    setCity("");
    setStateVal("");
    setZipCode("");
    setPhone("");
    setLabel("");
    setIsDefault(false);
  };

  const handleSave = async () => {
    if (!session?.user?.id || saving) return;
    setSaving(true);

    try {
      /** 1️⃣ If new address is default → reset others */
      if (isDefault) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", session.user.id);
      }

      /** 2️⃣ Insert new address */
      const { error } = await supabase.from("addresses").insert({
        user_id: session.user.id,
        full_name,
        street,
        city,
        state: stateVal,
        zip_code,
        phone,
        label,
        is_default: isDefault,
      });

      if (error) throw error;

      resetForm();

      /** 3️⃣ Go back to cart & reopen modal */
      router.push("/(user)/cart?openAddressModal=1");
    } catch (error) {
      console.log("Error adding address", error);
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
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
          />
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
