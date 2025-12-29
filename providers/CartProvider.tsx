import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { CartItem, ProductVariant, Tables } from "@/assets/data/types";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type Product = Tables<"products">;

type CartType = {
  items: CartItem[];
  addItem: (
    product: Product,
    size: ProductVariant,
    quantity?: number
  ) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  removeItem: (itemId: string) => void;
  total: number;
  checkout: (address?: Tables<"addresses">) => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  // Add item to cart
  const addItem = (
    product: Product,
    size: ProductVariant,
    quantity: number = 1
  ) => {
    const existingItem = items.find(
      (item) => item.product_id === product.id && item.size.label === size.label
    );

    if (existingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      return;
    }

    const newItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity,
    };

    setItems((prev) => [newItem, ...prev]);
  };

  // Update quantity
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Cart total
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.size.price * item.quantity, 0),
    [items]
  );

  const clearCart = () => {
    setItems([]);
  };

  // Checkout
  const checkout = (address?: Tables<"addresses">) => {
    if (items.length === 0) return;

    insertOrder(
      { total, address_id: address?.id ?? null },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  // Save order items after order is created
  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      variant_label: item.size.label,
      variant_price: item.size.price,
    }));

    insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        total,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

// Custom hook
export const useCart = () => useContext(CartContext);
