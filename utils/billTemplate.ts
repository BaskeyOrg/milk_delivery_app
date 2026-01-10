// import { Tables } from "@/assets/data/types";

// type OrderWithRelations = Tables<"orders"> & {
//   order_items: (Tables<"order_items"> & {
//     products?: Tables<"products"> | null;
//   })[];
//   addresses?: Tables<"addresses"> | null;
//   profiles?: Tables<"profiles"> | null;
//   subscription?: Tables<"subscriptions"> | null;
// };

// const PLAN_DAYS = {
//   weekly: 7,
//   monthly: 30,
// } as const;

// export const generateBillHTML = ({
//   order,
//   itemsTotal,
//   deliveryCharge,
// }: {
//   order: OrderWithRelations;
//   itemsTotal: number;
//   deliveryCharge: number;
// }) => {
//   const billDate = new Date().toDateString();

//   const subscriptionPlan = order.subscription?.plan_type ?? null;
//   const subscriptionDays =
//     subscriptionPlan && subscriptionPlan in PLAN_DAYS
//       ? PLAN_DAYS[subscriptionPlan as "weekly" | "monthly"]
//       : 1;

//   const subscriptionItemsTotal = itemsTotal * subscriptionDays;
//   const grandTotal = subscriptionItemsTotal + deliveryCharge;

//   const address = order.addresses;
//   const user = order.profiles;

//   return `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8" />
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         padding: 24px;
//         font-size: 14px;
//         color: #111;
//       }
//       h1, h2 {
//         text-align: center;
//         margin-bottom: 8px;
//       }
//       .muted {
//         color: #666;
//         font-size: 12px;
//       }
//       .section {
//         margin-top: 20px;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-top: 10px;
//       }
//       th, td {
//         border: 1px solid #ddd;
//         padding: 8px;
//         vertical-align: top;
//       }
//       th {
//         background: #f5f5f5;
//         text-align: left;
//       }
//       .right {
//         text-align: right;
//       }
//       .bold {
//         font-weight: bold;
//       }
//     </style>
//   </head>

//   <body>
//     <h1>Order Bill</h1>
//     <p class="muted">
//       <strong>Order ID:</strong> ${order.id}<br />
//       <strong>Bill Generated:</strong> ${billDate}
//     </p>

//     <!-- USER DETAILS -->
//     <div class="section">
//       <h3>User Details</h3>
//       <p>
//         <strong>Name:</strong> ${user?.full_name ?? "-"}<br />
//         <strong>Phone:</strong> ${user?.phone ?? "-"}
//       </p>
//     </div>

//     <!-- ADDRESS -->
//     <div class="section">
//       <h3>Delivery Address</h3>
//       <p>
//         ${address?.name ?? ""}<br />
//         ${address?.flat ?? ""} ${address?.floor ?? ""}<br />
//         ${address?.area ?? ""}<br />
//         ${address?.landmark ?? ""}<br />
//         Phone: ${address?.phone ?? ""}
//       </p>
//     </div>

//     <!-- SUBSCRIPTION DETAILS -->
//     ${
//       order.subscription
//         ? `
//       <div class="section">
//         <h3>Subscription Details</h3>
//         <table>
//           <tr>
//             <td>Plan</td>
//             <td class="bold">${order.subscription.plan_type}</td>
//           </tr>
//           <tr>
//             <td>Duration</td>
//             <td class="bold">${subscriptionDays} days</td>
//           </tr>
//           <tr>
//             <td>Start Date</td>
//             <td class="bold">${order.subscription.start_date}</td>
//           </tr>
//           <tr>
//             <td>Delivery Time</td>
//             <td class="bold">${order.subscription.delivery_time ?? "-"}</td>
//           </tr>
//         </table>
//       </div>
//     `
//         : ""
//     }

//     <!-- ITEMS LIST -->
//     <div class="section">
//       <h3>Items</h3>
//       <table>
//         <tr>
//           <th>Product</th>
//           <th>Variant</th>
//           <th>Qty</th>
//           <th class="right">Price</th>
//           <th class="right">Total</th>
//         </tr>

//         ${order.order_items
//           .map((item) => {
//             const productName = item.products?.name ?? "Unknown Product";
//             const lineTotal =
//               (item.variant_price ?? 0) * item.quantity;

//             return `
//             <tr>
//               <td>${productName}</td>
//               <td>${item.variant_label ?? "-"}</td>
//               <td>${item.quantity}</td>
//               <td class="right">₹ ${item.variant_price.toFixed(2)}</td>
//               <td class="right">₹ ${lineTotal.toFixed(2)}</td>
//             </tr>
//           `;
//           })
//           .join("")}
//       </table>
//     </div>

//     <!-- SUMMARY -->
//     <div class="section">
//       <h3>Summary</h3>
//       <table>
//         <tr>
//           <td>Items Total (per day)</td>
//           <td class="right bold">₹ ${itemsTotal.toFixed(2)}</td>
//         </tr>

//         ${
//           order.subscription
//             ? `
//           <tr>
//             <td>Items × ${subscriptionDays} days</td>
//             <td class="right bold">
//               ₹ ${subscriptionItemsTotal.toFixed(2)}
//             </td>
//           </tr>
//         `
//             : ""
//         }

//         <tr>
//           <td>Delivery Charge</td>
//           <td class="right bold">₹ ${deliveryCharge.toFixed(2)}</td>
//         </tr>

//         <tr>
//           <th>Total</th>
//           <th class="right">₹ ${grandTotal.toFixed(2)}</th>
//         </tr>
//       </table>
//     </div>
//   </body>
// </html>
// `;
// };


import { Tables } from "@/assets/data/types";

type OrderWithRelations = Tables<"orders"> & {
  order_items: (Tables<"order_items"> & {
    products?: Tables<"products"> | null;
  })[];
  addresses?: Tables<"addresses"> | null;
  profiles?: Tables<"profiles"> | null;
  subscription?: Tables<"subscriptions"> | null;
};

const PLAN_DAYS = {
  weekly: 7,
  monthly: 30,
} as const;

export const generateBillHTML = ({
  order,
  itemsTotal,
  deliveryCharge,
}: {
  order: OrderWithRelations;
  itemsTotal: number;
  deliveryCharge: number;
}) => {
  const billDate = new Date().toDateString();
  const isSubscribed = Boolean(order.subscription);

  const plan = order.subscription?.plan_type ?? null;
  const days =
    plan && plan in PLAN_DAYS
      ? PLAN_DAYS[plan as "weekly" | "monthly"]
      : 1;

  const subscriptionItemsTotal = itemsTotal * days;
  const oneTimeTotal = itemsTotal;
  const grandTotal = isSubscribed
    ? subscriptionItemsTotal + deliveryCharge
    : oneTimeTotal + deliveryCharge;

  const address = order.addresses;
  const user = order.profiles;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      font-size: 14px;
      color: #111;
    }
    h1 {
      text-align: center;
    }
    .section {
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background: #f5f5f5;
      text-align: left;
    }
    .right {
      text-align: right;
    }
    .bold {
      font-weight: bold;
    }
    .muted {
      color: #666;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <h1>Order Bill</h1>
  <p class="muted">
    <strong>Order ID:</strong> ${order.id}<br/>
    <strong>Bill Generated:</strong> ${billDate}
  </p>

  <!-- USER -->
  <div class="section">
    <h3>User Details</h3>
    <p>
      <strong>Name:</strong> ${user?.full_name ?? "-"}<br/>
      <strong>Phone:</strong> ${user?.phone ?? "-"}
    </p>
  </div>

  <!-- ADDRESS -->
  <div class="section">
    <h3>Delivery Address</h3>
    <p>
      ${address?.name ?? ""}<br/>
      ${address?.flat ?? ""} ${address?.floor ?? ""}<br/>
      ${address?.area ?? ""}<br/>
      ${address?.landmark ?? ""}<br/>
      Phone: ${address?.phone ?? ""}
    </p>
  </div>

  <!-- SUBSCRIPTION DETAILS -->
  ${
    isSubscribed
      ? `
    <div class="section">
      <h3>Subscription Details</h3>
      <table>
        <tr><td>Plan</td><td class="bold">${plan}</td></tr>
        <tr><td>Duration</td><td class="bold">${days} days</td></tr>
        <tr><td>Start Date</td><td class="bold">${order.subscription!.start_date}</td></tr>
        <tr><td>Delivery Time</td><td class="bold">${order.subscription!.delivery_time ?? "-"}</td></tr>
      </table>
    </div>
  `
      : ""
  }

  <!-- ITEMS -->
  <div class="section">
    <h3>Items</h3>
    <table>
      <tr>
        <th>Product</th>
        <th>Variant</th>
        <th>Qty</th>
        <th class="right">Price</th>
        <th class="right">Total</th>
      </tr>

      ${order.order_items
        .map((item) => {
          const lineTotal =
            (item.variant_price ?? 0) * item.quantity;
          return `
        <tr>
          <td>${item.products?.name ?? "Unknown Product"}</td>
          <td>${item.variant_label ?? "-"}</td>
          <td>${item.quantity}</td>
          <td class="right">₹ ${item.variant_price.toFixed(2)}</td>
          <td class="right">₹ ${lineTotal.toFixed(2)}</td>
        </tr>`;
        })
        .join("")}
    </table>
  </div>

  <!-- SUMMARY -->
  <div class="section">
    <h3>Summary</h3>
    <table>
      ${
        isSubscribed
          ? `
        <tr>
          <td>Items Total (per day)</td>
          <td class="right bold">₹ ${itemsTotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Items × ${days} days</td>
          <td class="right bold">₹ ${subscriptionItemsTotal.toFixed(2)}</td>
        </tr>
      `
          : `
        <tr>
          <td>Items Total</td>
          <td class="right bold">₹ ${oneTimeTotal.toFixed(2)}</td>
        </tr>
      `
      }

      <tr>
        <td>Delivery Charge</td>
        <td class="right bold">₹ ${deliveryCharge.toFixed(2)}</td>
      </tr>

      <tr>
        <th>Total</th>
        <th class="right">₹ ${grandTotal.toFixed(2)}</th>
      </tr>
    </table>
  </div>
</body>
</html>
`;
};
