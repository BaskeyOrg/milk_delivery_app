import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(
    typeof isString === "string" ? isString : isString?.[0]
  );

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const isUpdating = !!id;

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const validateInputs = () => {
    setErrors("");
    const errors = {};
    if (!name) {
      setErrors("Name is required");
      return false;
    }
    if (!price) {
      setErrors("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price must be a number");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onsubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInputs()) return;
    const imagePath = await uploadImage();

    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInputs()) return;

    const imagePath = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const confirmation = () => {
    Alert.alert("Are you sure?", "This will delete the product", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: onDelete,
        style: "destructive",
      },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    console.log("Error uploading image", error);

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text style={styles.textButton} onPress={pickImage}>
        Select Image
      </Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        placeholder="Enter price"
      />

      <Text style={styles.error}>{errors}</Text>
      <Button text={isUpdating ? "Update" : "Create"} onPress={onsubmit} />
      {isUpdating && (
        <Text onPress={confirmation} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
    color: Colors.light.tint,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
