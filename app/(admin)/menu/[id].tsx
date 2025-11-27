import { useProduct } from "@/api/products";
import { PizzaSize } from "@/assets/data/types";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { useCart } from "@/providers/CartProvider";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];
export default function ProductDetailsScreen() {
  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(typeof isString === "string" ? isString : isString?.[0]);
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  // const addToCart = () => {
  //   if (!product) return;
  //   addItem(product, selectedSize);
  //   router.push("/cart");
  // };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen options={{ title: product?.name, headerShown: true }} />

      {/* <Image
        source={{ uri: product?.image || defaultPizzaImage }}
        style={styles.image}
      /> */}
      <RemoteImage
          path={product?.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          // resizeMode='contain'
        />
      
      <Text style={styles.title}>{product.name}</Text>

      <Text style={styles.price}>Price: ₹ {product.price}</Text>
        
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
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
