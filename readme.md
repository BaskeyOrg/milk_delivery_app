npx supabase login
npx supabase gen types typescript --project-id bwreaukzhkzplfrinlbi > lib/database.types.ts

Expo push notifications:https://expo.dev/
amitbaskey99@gmail.com
Working@99

https://expo.dev/notifications
ExponentPushToken[n4auBVG_3JTGwVgcDesrOv]

postgresql://postgres:[Working@99]@db.bwreaukzhkzplfrinlbi.supabase.co:5432/postgres

npx supabase db dump --db-url "postgresql://postgres:[Working@99]@db.bwreaukzhkzplfrinlbi.supabase.co:5432/postgres
" -f schema.sql

pg_dump \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --format=custom \
  --dbname="postgresql://postgres:[Working@99]@db.bwreaukzhkzplfrinlbi.supabase.co:5432/postgres" \
  --file=supabase_full_backup.dump
pg_dump \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname="postgresql://postgres:[Working@99]@db.bwreaukzhkzplfrinlbi.supabase.co:5432/postgres" \
  > supabase_backup.sql

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.addresses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  address_type text DEFAULT 'Home'::text,
  name text NOT NULL,
  phone text NOT NULL CHECK (char_length(phone) = 10 AND phone ~ '^[0-9]+$'::text),
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  deleted boolean DEFAULT false,
  landmark text,
  area text,
  order_for text,
  flat text,
  floor text,
  latitude double precision,
  longitude double precision,
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notifications (
  id bigint NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  recipient_id uuid,
  subscription_id integer,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb,
  sent_at timestamp without time zone DEFAULT now(),
  status text DEFAULT 'sent'::text,
  error text,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.order_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  product_id bigint NOT NULL,
  variant_label text NOT NULL DEFAULT 'M'::text,
  quantity integer NOT NULL DEFAULT 1,
  order_id bigint NOT NULL,
  variant_price numeric NOT NULL DEFAULT 0,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New'::text,
  total double precision NOT NULL DEFAULT '0'::double precision,
  user_id uuid,
  status_updated_at timestamp without time zone DEFAULT now(),
  address_id bigint,
  subscription_id bigint,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id),
  CONSTRAINT orders_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  image text,
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text DEFAULT 'We provide daily doorstep delivery across Chennai, ensuring you receive fresh milk within hours of milking. Whether for children, elderly, or health-conscious individuals, our A2 cow milk is a nutritious choice for the whole family.'::text,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  username text UNIQUE CHECK (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  group text NOT NULL DEFAULT 'USER'::text,
  expo_push_token text,
  phone text,
  is_active boolean DEFAULT true,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.subscription_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  subscription_id bigint NOT NULL,
  product_id bigint NOT NULL,
  variant_label text NOT NULL,
  variant_price numeric NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  CONSTRAINT subscription_items_pkey PRIMARY KEY (id),
  CONSTRAINT subscription_items_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id),
  CONSTRAINT subscription_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.subscription_pauses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  subscription_id bigint NOT NULL,
  pause_date date NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscription_pauses_pkey PRIMARY KEY (id),
  CONSTRAINT subscription_pauses_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  plan_type text NOT NULL CHECK (plan_type = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text])),
  start_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  delivery_time text CHECK (delivery_time = ANY (ARRAY['morning'::text, 'evening'::text])),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.wishlist (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  product_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wishlist_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);