import { Tables } from "@/assets/data/types";
import { Link, useSegments } from "expo-router";
import { Pressable, Text } from "react-native";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

export default function ProductListItem({ product }: ProductListItemProps) {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable className="bg-white p-2 rounded-2xl flex-1 max-w-[50%] m-1">
        <RemoteImage
          path={product?.image ?? undefined}
          fallback={defaultPizzaImage}
          resizeMode="contain"
          className="w-full aspect-square rounded-xl"
        />

        <Text className="text-lg font-bold my-2 text-black">
          {product.name}
        </Text>
        <Text className="text-primary font-bold">
          ₹ {product.price}
        </Text>
      </Pressable>
    </Link>
  );
}
