import { Database } from "@/lib/database.types";

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];


// export type Product = {
//   id: number;
//   image: string | null;
//   name: string;
//   price: number;
// };

/** Product Variant */
export type ProductVariant = {
  label: string;
  price: number;
};

/** Product with typed variants */
export type Product = Omit<Tables<"products">, "variants"> & {
  variants: ProductVariant[];
};

// export type InsertOrderItem = InsertTables<"order_items">;
// export type InsertOrder = InsertTables<"orders">;
// export type UpdateOrder = UpdateTables<"orders">;


export type CartItem = {
  id: string;
  product: Tables<'products'>;
  product_id: number;
  size: ProductVariant;
  quantity: number;
};

export const OrderStatusList: OrderStatus[] = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
];

export type OrderStatus = 'New' | 'Cooking' | 'Delivering' | 'Delivered';

export type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  products: Tables<'products'>;
  order_id: number;
  size: ProductVariant;
  quantity: number;
};

// export type Profile = {
//   id: string;
//   group: string;
// };
