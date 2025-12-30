import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Variant = {
  label: string;
  price: string;
};

const priceRegex = /^\d+(\.\d{1,2})?$/;

export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [variants, setVariants] = useState<Variant[]>([
    { label: "", price: "" },
  ]);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { id: idString } = useLocalSearchParams();
  const id = Number(typeof idString === "string" ? idString : idString?.[0]);
  const isUpdating = !!id;

  const router = useRouter();

  const { data: updatingProduct } = useProduct(id);
  const { mutate: insertProduct, isPending: isCreating } = useInsertProduct();
  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const isSubmitting = isCreating || isUpdatingProduct || isDeleting;

  /* ---------------- LOAD PRODUCT ---------------- */
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setImage(updatingProduct.image);
      setVariants(
        updatingProduct.variants.map((v: any) => ({
          label: v.label,
          price: v.price.toString(),
        }))
      );
    }
  }, [updatingProduct]);

  /* ---------------- VALIDATION ---------------- */
  const isNameValid = name.trim().length > 0;

  const areVariantsValid =
    variants.length > 0 &&
    variants.every(
      (v) => v.label.trim().length > 0 && priceRegex.test(v.price)
    );

  const isFormValid = isNameValid && areVariantsValid;

  /* ---------------- IMAGE PICKER ---------------- */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) return image;

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });

    const filePath = `${randomUUID()}.png`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
      });

    if (error) throw error;
    return data.path;
  };

  /* ---------------- VARIANT ACTIONS ---------------- */
  const addVariant = () => {
    setVariants([...variants, { label: "", price: "" }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmRemoveVariant = (index: number) => {
    Alert.alert("Remove variant?", "This variant will be removed", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeVariant(index),
      },
    ]);
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      setError("Please fix the errors above");
      return;
    }

    setError("");

    try {
      const imagePath = await uploadImage();

      const payload = {
        name,
        image: imagePath,
        variants: variants.map((v) => ({
          label: v.label,
          price: Number(v.price),
        })),
      };

      if (isUpdating) {
        updateProduct({ id, ...payload }, { onSuccess: () => router.back() });
      } else {
        insertProduct(payload, { onSuccess: () => router.back() });
      }
    } catch {
      setError("Image upload failed");
    }
  };

  /* ---------------- DELETE PRODUCT ---------------- */
  const confirmDelete = () => {
    Alert.alert("Delete product?", "This action cannot be undone", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteProduct(id, { onSuccess: () => router.replace("/(admin)") }),
      },
    ]);
  };

  /* ---------------- UI ---------------- */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Stack.Screen
          options={{
            title: isUpdating ? "Update Product" : "Create Product",
          }}
        />

        <View className="flex-1 items-center px-6 bg-white">
          {/* IMAGE */}
          {isUpdating ? (
            <RemoteImage
              path={image ?? undefined}
              fallback={defaultImage}
              className="w-56 h-56 rounded-3xl mt-8"
            />
          ) : (
            <Image
              source={{ uri: image || defaultImage }}
              className="w-1/2 aspect-square self-center rounded-lg mt-8"
            />
          )}

          <Text
            onPress={pickImage}
            className="text-primary font-semibold mt-3 mb-6"
          >
            Change product image
          </Text>

          {/* NAME */}
          <Text className="text-sm mb-1">Product name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Product name"
            className="border rounded-full px-5 py-3 mb-4 w-full"
          />

          {/* VARIANTS */}
          <Text className="text-lg font-bold mb-3 self-start">Variants</Text>

          {variants.map((variant, index) => (
            <View
              key={index}
              className="flex-row items-center gap-3 mb-3 w-full"
            >
              <TextInput
                value={variant.label}
                onChangeText={(text) => {
                  const copy = [...variants];
                  copy[index].label = text;
                  setVariants(copy);
                }}
                placeholder="Quantity (e.g. 500ml)"
                className="flex-1 border rounded-full px-4 py-3"
              />

              <TextInput
                value={variant.price}
                onChangeText={(text) => {
                  const copy = [...variants];
                  copy[index].price = text;
                  setVariants(copy);
                }}
                placeholder="Price"
                keyboardType="numeric"
                className="w-24 border rounded-full px-4 py-3"
              />

              <Text
                onPress={() => confirmRemoveVariant(index)}
                className={`px-3 py-2 text-lg font-bold ${
                  variants.length === 1 || isSubmitting
                    ? "text-gray-300"
                    : "text-red-500"
                }`}
              >
                ✕
              </Text>
            </View>
          ))}

          <Text
            onPress={addVariant}
            className="text-primary font-semibold mb-6 self-start"
          >
            + Add variant
          </Text>

          {!!error && (
            <Text className="text-red-500 text-center mb-3">{error}</Text>
          )}

          <Button
            text={isUpdating ? "Update Product" : "Create Product"}
            onPress={onSubmit}
            disabled={!isFormValid || isSubmitting}
          />

          {isUpdating && (
            <View className="mt-6 items-center">
              {isDeleting ? (
                <ActivityIndicator color="red" />
              ) : (
                <Text
                  onPress={confirmDelete}
                  className="text-red-500 font-semibold"
                >
                  Delete Product
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
