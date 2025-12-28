import { useUpdateProfile } from "@/api/profile";
import GradientHeader from "@/components/GradientHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------------- CONSTANTS ---------------- */

const phoneRegex = /^[0-9]{10}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const defaultAvatar = require("@/assets/images/user-avatar.png"); // Adjust relative path

export default function EditProfile() {
  const router = useRouter();
  const { session } = useAuth();

  const userId = session?.user.id ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: updateProfile } = useUpdateProfile();


  const [form, setForm] = useState({
    full_name: "",
    username: "",
    phone: "",
    website: "",
    group: "",
    avatar_url: "" as string | null,
  });

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name ?? "",
          username: data.username ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          group: data.group ?? "",
          avatar_url: data.avatar_url ?? "",
        });
      }

      setLoading(false);
    })();
  }, [userId]);

  const update = (k: keyof typeof form, v: string | null) =>
    setForm((p) => ({ ...p, [k]: v }));

  /* ---------------- VALIDATION ---------------- */

  const errors = useMemo(
    () => ({
      full_name: !form.full_name.trim(),
      username: !!form.username && !usernameRegex.test(form.username),
      phone: !!form.phone && !phoneRegex.test(form.phone),
      website: !!form.website && !form.website.startsWith("http"),
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

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm((p) => ({ ...p, avatar_url: result.assets[0].uri }));
    }
  };

  const uploadImage = async () => {
    if (!form.avatar_url?.startsWith("file://")) return form.avatar_url;

    const base64 = await FileSystem.readAsStringAsync(form.avatar_url, {
      encoding: "base64",
    });

    const filePath = `${randomUUID()}.png`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
      });

    if (error) throw error;
    return data.path;
  };

  /* ---------------- SAVE ---------------- */

const handleSave = async () => {
  setSubmitted(true);
  if (!isValid || saving) return;

  setSaving(true);
  try {
    await updateProfile(form);
    router.back();
  } finally {
    setSaving(false);
  }
};


  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      {/* Gradient Header */}
      <GradientHeader title="Edit Profile" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <TouchableOpacity
          onPress={pickImage}
          className="self-center mt-6 relative"
        >
          <Image
            source={
              form.avatar_url
                ? { uri: form.avatar_url }
                : defaultAvatar
            }
            className="w-28 h-28 rounded-full bg-surface"
          />
          
          <View className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
            <Ionicons name="pencil" size={18} color="white" />
          </View>
        </TouchableOpacity>

        {/* Full Name */}
        <TextInput
          placeholder="Full name"
          placeholderTextColor="#9CA3AF"
          value={form.full_name}
          onChangeText={(v) => update("full_name", v)}
          className={inputClass(errors.full_name)}
        />

        {/* Username */}
        <TextInput
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={form.username}
          onChangeText={(v) => update("username", v)}
          className={`${inputClass(errors.username)} mt-4`}
        />
        {errors.username && submitted && (
          <Text className="text-accent-error text-xs mt-1 ml-2">
            Username must be 3–20 characters (letters, numbers, _)
          </Text>
        )}

        {/* Phone */}
        <TextInput
          placeholder="Mobile number"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={(v) => update("phone", v)}
          className={`${inputClass(errors.phone)} mt-4`}
        />
        {errors.phone && submitted && (
          <Text className="text-accent-error text-xs mt-1 ml-2">
            Enter a valid 10-digit phone number
          </Text>
        )}

        {/* Website */}
        <TextInput
          placeholder="Website (https://...)"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={form.website}
          onChangeText={(v) => update("website", v)}
          className={`${inputClass(errors.website)} mt-4`}
        />
        {errors.website && submitted && (
          <Text className="text-accent-error text-xs mt-1 ml-2">
            Website must start with http or https
          </Text>
        )}

        {/* Group (read-only) */}
        <View className="mt-4">
          <Text className="mb-2 text-text-secondary text-sm">Account type</Text>
          <View className="rounded-2xl px-4 py-4 bg-surface border border-border">
            <Text className="text-text-primary font-medium">
              {form.group || "User"}
            </Text>
          </View>
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
              Save Profile
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
