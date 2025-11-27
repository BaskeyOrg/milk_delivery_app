import { Tables } from "@/assets/data/types";
import Colors from "@/constants/Colors";
import { Link, useSegments } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<'products'>;
};
export default function ProductListItem({ product }: ProductListItemProps) {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        {/* <Image
          style={styles.image}
          source={{ uri: product.image || defaultPizzaImage }}
          resizeMode="contain"
        /> */}
        <RemoteImage
          path={product?.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode='contain'
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>₹ {product.price}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
