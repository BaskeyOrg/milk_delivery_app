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
  checkout: (address: Tables<"addresses">) => void;
  isCheckingOut: boolean;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  total: 0,
  checkout: () => {},
  isCheckingOut: false,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const router = useRouter();

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  /* ---------------- ADD ITEM ---------------- */
  const addItem = (
    product: Product,
    size: ProductVariant,
    quantity = 1
  ) => {
    const existingItem = items.find(
      (item) =>
        item.product_id === product.id &&
        item.size.label === size.label
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

    setItems((prev) => [
      {
        id: randomUUID(),
        product,
        product_id: product.id,
        size,
        quantity,
      },
      ...prev,
    ]);
  };

  /* ---------------- UPDATE QTY ---------------- */
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* ---------------- REMOVE ---------------- */
  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  /* ---------------- TOTAL ---------------- */
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.size.price * item.quantity,
        0
      ),
    [items]
  );

  const clearCart = () => setItems([]);

  /* ---------------- CHECKOUT ---------------- */
  const checkout = (address: Tables<"addresses">) => {
    if (!items.length || isCheckingOut) return;

    setIsCheckingOut(true);

    insertOrder(
      {
        total,
        address_id: address.id,
      },
      {
        onSuccess: saveOrderItems,
        onError() {
          setIsCheckingOut(false);
        },
      }
    );
  };

  /* ---------------- SAVE ORDER ITEMS ---------------- */
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
        setIsCheckingOut(false);
        router.replace(`/(user)/orders/${order.id}`);
      },
      onError() {
        setIsCheckingOut(false);
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
        isCheckingOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
