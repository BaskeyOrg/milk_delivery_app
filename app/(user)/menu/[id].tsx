import { useProduct } from "@/api/products";
import { PizzaSize } from "@/assets/data/types";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import { useCart } from "@/providers/CartProvider";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];
export default function ProductDetailsScreen() {
  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(typeof isString === "string" ? isString : isString?.[0]);
  const { data: product, error, isLoading } = useProduct(id);

  const { addItem } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push("/(user)/cart");
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name, headerShown: true }} />

      {/* <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      /> */}
      <RemoteImage
          path={product?.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode='contain'
        />

      <Text>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            key={size}
            onPress={() => setSelectedSize(size)}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === size ? "gainsboro" : "",
              },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                {
                  color: selectedSize === size ? "black" : "gray",
                },
              ]}
              key={size}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>Price: ₹ {product.price}</Text>
      <Button onPress={addToCart} text="Add to cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: "auto",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  size: {
    borderRadius: 25,
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
