import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { CartItem, Tables } from "@/assets/data/types";
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
    size: CartItem["size"],
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

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const addItem = (
    product: Product,
    size: CartItem["size"],
    quantity: number = 1
  ) => {
    const existingItem = items.find(
      (item) => item.product_id === product.id && item.size === size
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

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity,
    };

    setItems((prev) => [newCartItem, ...prev]);
  };

  // updateQuantity
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

  const removeItem = (itemId: string) => {
  setItems((prev) => prev.filter((item) => item.id !== itemId));
};

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [items]);

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async (address?: Tables<"addresses">) => {
    // Insert order and include address_id when provided
    insertOrder(
      { total, address_id: address?.id ?? null },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
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
      value={{ items, addItem, updateQuantity, removeItem, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
